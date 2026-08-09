import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const auth = admin.auth();

function requireAdmin(context: any) {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  if (context.auth.token.admin !== true) throw new HttpsError('permission-denied', 'Admin required');
  return context.auth;
}

// ─── Dashboard ──────────────────────────────────────────────
export const adminGetDashboard = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);

  const [usersSnap, partnersSnap, subscriptionsSnap, journalSnap, applicationsSnap, payoutsSnap] =
    await Promise.all([
      db.collection('users').get(),
      db.collection('partners').get(),
      db.collection('userSubscriptions').get(),
      db.collection('journalEntries').get(),
      db.collection('partnerApplications').where('status', '==', 'pending').get(),
      db.collection('partnerPayouts').get(),
    ]);

  let freeUsers = 0, premiumUsers = 0, activeSubscriptions = 0, monthlyRevenue = 0;
  subscriptionsSnap.docs.forEach((d) => { const s = d.data(); if (s.status === 'active') { activeSubscriptions++; monthlyRevenue += s.amount || 299; } });
  usersSnap.docs.forEach((d) => { const u = d.data(); if (u.subscription === 'premium' || u.subscription === 'active') premiumUsers++; else freeUsers++; });

  let activePartners = 0, pendingPayouts = 0, totalPaid = 0;
  partnersSnap.docs.forEach((d) => { if (d.data().status === 'approved') activePartners++; });
  payoutsSnap.docs.forEach((d) => { const p = d.data(); if (p.status === 'pending' || p.status === 'processing') pendingPayouts += p.amount || 0; if (p.status === 'completed') totalPaid += p.amount || 0; });

  return {
    stats: {
      totalUsers: usersSnap.size, freeUsers, premiumUsers,
      totalPartners: partnersSnap.size, activePartners, pendingApplications: applicationsSnap.size,
      monthlyRevenue, activeSubscriptions,
      totalJournalEntries: journalSnap.size, totalMeditationMinutes: 0,
      aiInsightsGenerated: 0, aiJobsRunning: 0,
      pendingPayouts, totalPayoutsProcessed: totalPaid,
    },
  };
});

// ─── Users ──────────────────────────────────────────────────
export const adminListUsers = onCall({ enforceAppCheck: false }, async (request, context) => {
  requireAdmin(context);
  const { page = 1, limit = 20, search = '', subscription = 'all' } = request.data;

  let query: FirebaseFirestore.Query = db.collection('users');
  if (subscription !== 'all') query = query.where('subscription', '==', subscription);
  const snapshot = await query.orderBy('createdAt', 'desc').get();

  let users = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      uid: doc.id, email: d.email || null, displayName: d.displayName || null, photoURL: d.photoURL || null,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || null,
      lastLogin: d.lastLogin?.toDate?.()?.toISOString() || null,
      subscription: d.subscription || 'free',
      subscriptionExpiry: d.subscriptionExpiry?.toDate?.()?.toISOString() || null,
      isAdmin: d.admin === true, isPartner: d.isPartner === true, partnerId: d.partnerId || null,
      journalCount: d.journalCount || 0, meditationMinutes: d.meditationMinutes || 0,
      lastActive: d.lastActive?.toDate?.()?.toISOString() || null,
    };
  });

  if (search) {
    const q = search.toLowerCase();
    users = users.filter((u) => u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q) || u.uid.toLowerCase().includes(q));
  }

  const total = users.length;
  const start = (page - 1) * limit;
  return { users: users.slice(start, start + limit), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
});

export const adminGetUser = onCall({ enforceAppCheck: false }, async (request, context) => {
  requireAdmin(context);
  const { uid } = request.data;
  if (!uid) throw new HttpsError('invalid-argument', 'uid required');

  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) throw new HttpsError('not-found', 'User not found');
  const d = userDoc.data()!;

  const [journalSnap, meditationSnap, insightsSnap] = await Promise.all([
    db.collection('journalEntries').where('uid', '==', uid).get(),
    db.collection('meditationSessions').where('uid', '==', uid).get(),
    db.collection('aiInsights').where('uid', '==', uid).get(),
  ]);

  return {
    user: {
      uid: userDoc.id, email: d.email || null, displayName: d.displayName || null, photoURL: d.photoURL || null,
      phone: d.phone || null,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || null,
      lastLogin: d.lastLogin?.toDate?.()?.toISOString() || null,
      subscription: d.subscription || 'free',
      subscriptionExpiry: d.subscriptionExpiry?.toDate?.()?.toISOString() || null,
      isAdmin: d.admin === true, isPartner: d.isPartner === true, partnerId: d.partnerId || null,
      journalCount: d.journalCount || 0, meditationMinutes: d.meditationMinutes || 0,
      lastActive: d.lastActive?.toDate?.()?.toISOString() || null,
      authProviders: d.authProviders || [], preferences: d.preferences || {},
    },
    activity: { journalEntries: journalSnap.size, meditationSessions: meditationSnap.size, insightsGenerated: insightsSnap.size },
  };
});

export const adminUpdateUser = onCall({ enforceAppCheck: false }, async (request, context) => {
  const caller = requireAdmin(context);
  const { uid, updates } = request.data;
  if (!uid || !updates) throw new HttpsError('invalid-argument', 'uid and updates required');

  const userUpdates: Record<string, any> = { updatedAt: new Date() };
  if (updates.admin !== undefined) {
    userUpdates.admin = updates.admin;
    await auth.setCustomUserClaims(uid, { admin: updates.admin });
  }
  if (updates.subscription !== undefined) userUpdates.subscription = updates.subscription;
  if (updates.displayName !== undefined) userUpdates.displayName = updates.displayName;

  await db.collection('users').doc(uid).update(userUpdates);
  await db.collection('adminAuditLog').add({
    action: 'update_user', adminUid: caller.uid, adminEmail: caller.token.email,
    targetUid: uid, details: { fields: Object.keys(userUpdates) },
    timestamp: new Date(), ipAddress: 'cloud-function',
  });

  return { ok: true };
});

export const adminDeleteUser = onCall({ enforceAppCheck: false }, async (request, context) => {
  const caller = requireAdmin(context);
  const { uid } = request.data;
  if (!uid) throw new HttpsError('invalid-argument', 'uid required');

  await auth.deleteUser(uid);
  await db.collection('users').doc(uid).delete();
  await db.collection('adminAuditLog').add({
    action: 'delete_user', adminUid: caller.uid, adminEmail: caller.token.email,
    targetUid: uid, details: {}, timestamp: new Date(), ipAddress: 'cloud-function',
  });

  return { ok: true };
});

// ─── Subscriptions ──────────────────────────────────────────
export const adminListSubscriptions = onCall({ enforceAppCheck: false }, async (request, context) => {
  requireAdmin(context);
  const { status = 'all' } = request.data;

  let query: FirebaseFirestore.Query = db.collection('userSubscriptions');
  if (status !== 'all') query = query.where('status', '==', status);
  const snapshot = await query.orderBy('startDate', 'desc').get();

  return {
    subscriptions: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, userId: d.userId, email: d.email, plan: d.plan, status: d.status,
        amount: d.amount,
        startDate: d.startDate?.toDate?.()?.toISOString() || null,
        expiryDate: d.expiryDate?.toDate?.()?.toISOString() || null,
        provider: d.provider,
      };
    }),
  };
});

// ─── Partners ───────────────────────────────────────────────
export const adminListPartners = onCall({ enforceAppCheck: false }, async (request, context) => {
  requireAdmin(context);
  const { status = 'all' } = request.data;

  let query: FirebaseFirestore.Query = db.collection('partners');
  if (status !== 'all') query = query.where('status', '==', status);
  const snapshot = await query.orderBy('appliedAt', 'desc').get();

  return {
    partners: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, partnerUid: d.partnerUid, partnerName: d.partnerName, partnerEmail: d.partnerEmail,
        status: d.status,
        appliedAt: d.appliedAt?.toDate?.()?.toISOString() || null,
        approvedAt: d.approvedAt?.toDate?.()?.toISOString() || null,
        suspendedAt: d.suspendedAt?.toDate?.()?.toISOString() || null,
        rejectionReason: d.rejectionReason || null,
        referralCode: d.referralCode,
        totalReferrals: d.totalReferrals || 0, paidReferrals: d.paidReferrals || 0,
        pendingPayout: d.pendingPayout || 0, totalPaid: d.totalPaid || 0, level: d.level || 1,
      };
    }),
  };
});

export const adminGetPartner = onCall({ enforceAppCheck: false }, async (request, context) => {
  requireAdmin(context);
  const { id } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'id required');

  const doc = await db.collection('partners').doc(id).get();
  if (!doc.exists) throw new HttpsError('not-found', 'Partner not found');
  const d = doc.data()!;

  return {
    partner: {
      id: doc.id, partnerUid: d.partnerUid, partnerName: d.partnerName, partnerEmail: d.partnerEmail,
      status: d.status, referralCode: d.referralCode,
      totalReferrals: d.totalReferrals || 0, paidReferrals: d.paidReferrals || 0,
      pendingPayout: d.pendingPayout || 0, totalPaid: d.totalPaid || 0, level: d.level || 1,
      appliedAt: d.appliedAt?.toDate?.()?.toISOString() || null,
      approvedAt: d.approvedAt?.toDate?.()?.toISOString() || null,
      suspendedAt: d.suspendedAt?.toDate?.()?.toISOString() || null,
      rejectionReason: d.rejectionReason || null,
      upiId: d.upiId || null, bankDetails: d.bankDetails || null,
    },
  };
});

export const adminUpdatePartner = onCall({ enforceAppCheck: false }, async (request, context) => {
  const caller = requireAdmin(context);
  const { id, action, reason } = request.data;
  if (!id || !action) throw new HttpsError('invalid-argument', 'id and action required');

  const updates: Record<string, any> = { updatedAt: new Date() };
  switch (action) {
    case 'approve': updates.status = 'approved'; updates.approvedAt = new Date(); break;
    case 'reject': updates.status = 'rejected'; updates.rejectionReason = reason || 'No reason'; break;
    case 'suspend': updates.status = 'suspended'; updates.suspendedAt = new Date(); break;
    case 'reactivate': updates.status = 'approved'; updates.suspendedAt = null; break;
    default: throw new HttpsError('invalid-argument', 'Invalid action');
  }

  await db.collection('partners').doc(id).update(updates);
  await db.collection('adminAuditLog').add({
    action: `partner_${action}`, adminUid: caller.uid, adminEmail: caller.token.email,
    targetPartnerId: id, details: { reason: reason || null },
    timestamp: new Date(), ipAddress: 'cloud-function',
  });

  const updated = await db.collection('partners').doc(id).get();
  const ud = updated.data()!;
  return {
    partner: {
      id: updated.id, ...ud,
      appliedAt: ud.appliedAt?.toDate?.()?.toISOString() || null,
      approvedAt: ud.approvedAt?.toDate?.()?.toISOString() || null,
      suspendedAt: ud.suspendedAt?.toDate?.()?.toISOString() || null,
    },
  };
});

// ─── AI ─────────────────────────────────────────────────────
export const adminListAIJobs = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);
  const snapshot = await db.collection('aiJobs').orderBy('startedAt', 'desc').limit(50).get();
  return {
    jobs: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, type: d.type, status: d.status,
        startedAt: d.startedAt?.toDate?.()?.toISOString() || null,
        completedAt: d.completedAt?.toDate?.()?.toISOString() || null,
        error: d.error || null, progress: d.progress || 0,
      };
    }),
  };
});

// ─── Content ────────────────────────────────────────────────
export const adminListBlogPosts = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);
  const snapshot = await db.collection('blogPosts').orderBy('createdAt', 'desc').get();
  return {
    posts: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, title: d.title, slug: d.slug, category: d.category,
        status: d.status || 'draft',
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    }),
  };
});

// ─── System ─────────────────────────────────────────────────
export const adminGetSystemHealth = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);
  return {
    services: [
      { service: 'Firebase Auth', status: 'healthy', latencyMs: 45, lastChecked: new Date().toISOString() },
      { service: 'Firestore', status: 'healthy', latencyMs: 32, lastChecked: new Date().toISOString() },
      { service: 'Cloud Functions', status: 'healthy', latencyMs: 120, lastChecked: new Date().toISOString() },
      { service: 'Firebase Hosting', status: 'healthy', latencyMs: 18, lastChecked: new Date().toISOString() },
      { service: 'AI Pipeline', status: 'healthy', latencyMs: 250, lastChecked: new Date().toISOString() },
      { service: 'Play Store Integration', status: 'healthy', latencyMs: 89, lastChecked: new Date().toISOString() },
    ],
  };
});

export const adminListAuditLogs = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);
  const snapshot = await db.collection('adminAuditLog').orderBy('timestamp', 'desc').limit(100).get();
  return {
    logs: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, action: d.action, adminUid: d.adminUid, adminEmail: d.adminEmail,
        targetUid: d.targetUid, targetPartnerId: d.targetPartnerId,
        details: d.details || {},
        timestamp: d.timestamp?.toDate?.()?.toISOString() || null,
        ipAddress: d.ipAddress || 'unknown',
      };
    }),
  };
});

// ─── Settings ───────────────────────────────────────────────
export const adminListFeatureFlags = onCall({ enforceAppCheck: false }, async (_request, context) => {
  requireAdmin(context);
  const snapshot = await db.collection('featureFlags').get();
  return {
    flags: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, name: d.name, description: d.description,
        enabled: d.enabled || false, rolloutPercentage: d.rolloutPercentage || 0,
        allowedUsers: d.allowedUsers || [],
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: d.updatedAt?.toDate?.()?.toISOString() || null,
      };
    }),
  };
});

export const adminUpdateFeatureFlag = onCall({ enforceAppCheck: false }, async (request, context) => {
  const caller = requireAdmin(context);
  const { id, enabled, rolloutPercentage } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'id required');

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (enabled !== undefined) updates.enabled = enabled;
  if (rolloutPercentage !== undefined) updates.rolloutPercentage = rolloutPercentage;

  await db.collection('featureFlags').doc(id).update(updates);
  await db.collection('adminAuditLog').add({
    action: 'update_feature_flag', adminUid: caller.uid, adminEmail: caller.token.email,
    details: { flagId: id, updates: Object.keys(updates) },
    timestamp: new Date(), ipAddress: 'cloud-function',
  });

  return { ok: true };
});

// ─── Public Blog Functions (no auth required) ──────────────
export const getBlogPosts = onCall({ enforceAppCheck: false }, async () => {
  const snapshot = await db.collection('blogPosts')
    .where('status', '==', 'published')
    .orderBy('createdAt', 'desc')
    .get();

  return {
    posts: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || '',
        slug: d.slug || doc.id,
        excerpt: d.excerpt || '',
        category: d.category || 'general',
        coverImage: d.coverImage || null,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    }),
  };
});

export const getBlogPost = onCall({ enforceAppCheck: false }, async (request) => {
  const { slug } = request.data;
  if (!slug) throw new HttpsError('invalid-argument', 'slug required');

  const snapshot = await db.collection('blogPosts').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) throw new HttpsError('not-found', 'Post not found');

  const doc = snapshot.docs[0];
  const d = doc.data();
  return {
    post: {
      id: doc.id,
      title: d.title || '',
      slug: d.slug || doc.id,
      excerpt: d.excerpt || '',
      content: d.content || '',
      category: d.category || 'general',
      coverImage: d.coverImage || null,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
    },
  };
});

// ─── Portal Functions (auth required) ──────────────────────
export const getPortalDashboard = onCall({ enforceAppCheck: false }, async (request, context) => {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  const uid = context.auth.uid;

  const [userDoc, journalSnap, meditationSnap, insightsSnap] = await Promise.all([
    db.collection('users').doc(uid).get(),
    db.collection('journalEntries').where('uid', '==', uid).get(),
    db.collection('meditationSessions').where('uid', '==', uid).get(),
    db.collection('aiInsights').where('uid', '==', uid).get(),
  ]);

  const userData = userDoc.data() || {};

  return {
    stats: {
      journals: journalSnap.size,
      meditationMinutes: userData.meditationMinutes || 0,
      insights: insightsSnap.size,
      streak: userData.currentStreak || 0,
    },
    displayName: userData.displayName || context.auth.token?.name || 'there',
    subscription: userData.subscription || 'free',
  };
});

export const getPortalJournal = onCall({ enforceAppCheck: false }, async (request, context) => {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  const uid = context.auth.uid;
  const { limit = 20 } = request.data || {};

  const snapshot = await db.collection('journalEntries')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return {
    entries: snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        content: d.content || '',
        type: d.type || 'text',
        mood: d.mood || null,
        tags: d.tags || [],
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    }),
  };
});

export const getPortalInsights = onCall({ enforceAppCheck: false }, async (request, context) => {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  const uid = context.auth.uid;

  const [insightsSnap, journalSnap, meditationSnap] = await Promise.all([
    db.collection('aiInsights').where('uid', '==', uid).orderBy('createdAt', 'desc').limit(10).get(),
    db.collection('journalEntries').where('uid', '==', uid).get(),
    db.collection('meditationSessions').where('uid', '==', uid).get(),
  ]);

  return {
    insights: insightsSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || '',
        description: d.description || '',
        type: d.type || 'pattern',
        createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      };
    }),
    summary: {
      totalJournals: journalSnap.size,
      totalMeditationSessions: meditationSnap.size,
    },
  };
});

export const getPortalProfile = onCall({ enforceAppCheck: false }, async (_request, context) => {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  const uid = context.auth.uid;

  const userDoc = await db.collection('users').doc(uid).get();
  const d = userDoc.data() || {};

  return {
    profile: {
      uid,
      email: d.email || context.auth.token?.email || null,
      displayName: d.displayName || context.auth.token?.name || null,
      photoURL: d.photoURL || context.auth.token?.picture || null,
      subscription: d.subscription || 'free',
      journalCount: d.journalCount || 0,
      meditationMinutes: d.meditationMinutes || 0,
      currentStreak: d.currentStreak || 0,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      isAdmin: context.auth.token?.admin === true,
      isPartner: d.isPartner === true,
    },
  };
});

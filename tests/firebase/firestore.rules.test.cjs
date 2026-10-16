const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, serverTimestamp } = require('firebase/firestore');

let env;
const projectId = 'demo-enso-security';
const rules = fs.readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8');

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

async function seedUser(uid, data = {}) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'users', uid), {
      email: uid + '@example.test',
      displayName: 'Test User',
      createdAt: new Date(),
      lastLogin: new Date(),
      subscription: 'free',
      admin: false,
      isPartner: false,
      ...data,
    });
  });
}

describe('Firestore owner and schema enforcement', () => {
  it('denies unauthenticated private reads and writes', async () => {
    await seedUser('alice');
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'users/alice')));
    await assertFails(addDoc(collection(db, 'journalEntries'), {
      uid: 'alice', content: 'hi', type: 'text', createdAt: serverTimestamp(),
    }));
  });

  it('allows an owner to read own profile but denies another user', async () => {
    await seedUser('alice');
    const alice = env.authenticatedContext('alice').firestore();
    const bob = env.authenticatedContext('bob').firestore();
    await assertSucceeds(getDoc(doc(alice, 'users/alice')));
    await assertFails(getDoc(doc(bob, 'users/alice')));
  });

  it('allows free profile creation but denies forged premium/admin/partner fields', async () => {
    const alice = env.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(alice, 'users/alice'), {
      email: 'alice@example.test', displayName: 'Alice', photoURL: null,
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
      subscription: 'free', admin: false, isPartner: false,
    }));
    await assertFails(setDoc(doc(alice, 'users/evil'), {
      email: 'alice@example.test', displayName: 'Alice',
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
      subscription: 'active', admin: true, isPartner: true,
    }));
  });

  it('prevents entitlement changes, uid changes and unknown profile fields', async () => {
    await seedUser('alice');
    const alice = env.authenticatedContext('alice').firestore();
    await assertFails(updateDoc(doc(alice, 'users/alice'), { subscription: 'active' }));
    await assertFails(updateDoc(doc(alice, 'users/alice'), { admin: true }));
    await assertFails(updateDoc(doc(alice, 'users/alice'), { uid: 'bob' }));
    await assertFails(updateDoc(doc(alice, 'users/alice'), { arbitraryServerFlag: true }));
    await assertSucceeds(updateDoc(doc(alice, 'users/alice'), { displayName: 'Alice Updated' }));
  });

  it('validates journal owner, required fields and update allowlist', async () => {
    await seedUser('alice');
    const alice = env.authenticatedContext('alice').firestore();
    const bob = env.authenticatedContext('bob').firestore();
    const good = { uid: 'alice', content: 'A thought', type: 'text', createdAt: serverTimestamp() };
    await assertSucceeds(setDoc(doc(alice, 'journalEntries/entry1'), good));
    await assertFails(setDoc(doc(alice, 'journalEntries/forged'), { ...good, uid: 'bob' }));
    await assertFails(setDoc(doc(alice, 'journalEntries/missing'), { uid: 'alice', type: 'text' }));
    await assertFails(setDoc(doc(alice, 'journalEntries/malformed'), { ...good, content: 55 }));
    await assertFails(getDoc(doc(bob, 'journalEntries/entry1')));
    await assertFails(updateDoc(doc(alice, 'journalEntries/entry1'), { uid: 'bob' }));
    await assertFails(updateDoc(doc(alice, 'journalEntries/entry1'), { createdAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(alice, 'journalEntries/entry1'), { content: 'Edited' }));
    await assertSucceeds(deleteDoc(doc(alice, 'journalEntries/entry1')));
    await assertFails(deleteDoc(doc(bob, 'journalEntries/entry1')));
  });

  it('allows valid meditation sessions and rejects forged or malformed records', async () => {
    const alice = env.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(alice, 'meditationSessions/s1'), {
      uid: 'alice', durationSeconds: 60, plannedMinutes: 5,
      completed: true, createdAt: serverTimestamp(),
    }));
    await assertFails(setDoc(doc(alice, 'meditationSessions/s2'), {
      uid: 'bob', durationSeconds: 60, plannedMinutes: 5,
      completed: true, createdAt: serverTimestamp(),
    }));
    await assertFails(setDoc(doc(alice, 'meditationSessions/s3'), {
      uid: 'alice', durationSeconds: -1, plannedMinutes: 5,
      completed: true, createdAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(doc(alice, 'meditationSessions/s1'), { completed: false }));
  });

  it('keeps AI insights and subscription records client read-only', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'aiInsights/i1'), { uid: 'alice', title: 'Insight' });
      await setDoc(doc(ctx.firestore(), 'userSubscriptions/alice'), { status: 'active' });
    });
    const alice = env.authenticatedContext('alice').firestore();
    await assertSucceeds(getDoc(doc(alice, 'aiInsights/i1')));
    await assertFails(setDoc(doc(alice, 'aiInsights/i2'), { uid: 'alice', title: 'Forged' }));
    await assertFails(setDoc(doc(alice, 'userSubscriptions/alice'), { status: 'active' }));
    await assertFails(updateDoc(doc(alice, 'userSubscriptions/alice'), { status: 'active' }));
  });

  it('validates composite IDs and prevents cross-user reflection/progress access', async () => {
    const alice = env.authenticatedContext('alice').firestore();
    const reflection = {
      uid: 'alice', date: '2026-10-16', createdAt: serverTimestamp(), answer: 'Reflecting',
    };
    await assertSucceeds(setDoc(doc(alice, 'dailyReflections/alice_2026-10-16'), reflection));
    await assertFails(setDoc(doc(alice, 'dailyReflections/bob_2026-10-16'), reflection));
    await assertFails(setDoc(doc(alice, 'roomProgress/bob_room'), {
      uid: 'alice', roomId: 'room', updatedAt: serverTimestamp(), progress: 20,
    }));
    await assertSucceeds(setDoc(doc(alice, 'roomProgress/alice_room'), {
      uid: 'alice', roomId: 'room', updatedAt: serverTimestamp(), progress: 20,
    }));
    await assertFails(updateDoc(doc(alice, 'roomProgress/alice_room'), { uid: 'bob' }));
  });

  it('denies direct client writes to partner financial and admin data', async () => {
    const alice = env.authenticatedContext('alice').firestore();
    await assertFails(setDoc(doc(alice, 'partner_profiles/alice'), { status: 'ACTIVE', balances: { availableMinor: 999999 } }));
    await assertFails(setDoc(doc(alice, 'subscriptions/fake-receipt'), { uid: 'alice', status: 'active' }));
    await assertFails(setDoc(doc(alice, 'adminAuditLog/fake'), { action: 'admin' }));
    await assertFails(setDoc(doc(alice, 'featureFlags/premium'), { enabled: true }));
  });
});

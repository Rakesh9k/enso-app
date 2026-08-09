import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app);

async function call<T>(name: string, data?: Record<string, unknown>): Promise<T> {
  const fn = httpsCallable(functions, name);
  const result = await fn(data);
  return result.data as T;
}

// ─── Dashboard ──────────────────────────────────────────────
export async function fetchDashboardStats() {
  return call<{ stats: any }>('adminGetDashboard');
}

// ─── Users ──────────────────────────────────────────────────
export async function fetchUsers(params: { page?: number; limit?: number; search?: string; subscription?: string } = {}) {
  return call<any>('adminListUsers', params);
}

export async function fetchUser(uid: string) {
  return call<any>('adminGetUser', { uid });
}

export async function updateUser(uid: string, updates: Record<string, unknown>) {
  return call<any>('adminUpdateUser', { uid, updates });
}

export async function deleteUser(uid: string) {
  return call<any>('adminDeleteUser', { uid });
}

// ─── Subscriptions ──────────────────────────────────────────
export async function fetchSubscriptions(status = 'all') {
  return call<any>('adminListSubscriptions', { status });
}

// ─── Partners ───────────────────────────────────────────────
export async function fetchPartners(status = 'all') {
  return call<any>('adminListPartners', { status });
}

export async function fetchPartner(id: string) {
  return call<any>('adminGetPartner', { id });
}

export async function updatePartner(id: string, action: string, reason?: string) {
  return call<any>('adminUpdatePartner', { id, action, reason });
}

// ─── AI ─────────────────────────────────────────────────────
export async function fetchAIJobs() {
  return call<any>('adminListAIJobs');
}

// ─── Content ────────────────────────────────────────────────
export async function adminFetchBlogPosts() {
  return call<any>('adminListBlogPosts');
}

// ─── System ─────────────────────────────────────────────────
export async function fetchSystemHealth() {
  return call<any>('adminGetSystemHealth');
}

export async function fetchAuditLogs() {
  return call<any>('adminListAuditLogs');
}

// ─── Settings ───────────────────────────────────────────────
export async function fetchFeatureFlags() {
  return call<any>('adminListFeatureFlags');
}

export async function updateFeatureFlag(id: string, updates: { enabled?: boolean; rolloutPercentage?: number }) {
  return call<any>('adminUpdateFeatureFlag', { id, ...updates });
}

// ─── Public Blog (no auth required) ────────────────────────
export async function fetchBlogPosts() {
  return call<any>('getBlogPosts');
}

export async function fetchBlogPost(slug: string) {
  return call<any>('getBlogPost', { slug });
}

// ─── Portal (auth required) ────────────────────────────────
export async function fetchPortalDashboard() {
  return call<any>('getPortalDashboard');
}

export async function fetchPortalJournal(limit = 20) {
  return call<any>('getPortalJournal', { limit });
}

export async function fetchPortalInsights() {
  return call<any>('getPortalInsights');
}

export async function fetchPortalProfile() {
  return call<any>('getPortalProfile');
}

// ─── Partner Portal (auth required) ────────────────────────
export async function fetchPartnerDashboard() {
  return call<any>('getPartnerDashboard');
}

export async function fetchPartnerStats() {
  return call<any>('getPartnerDashboard');
}

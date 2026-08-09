import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

const SESSION_COOKIE = '__session';
const USER_COLLECTION = 'users';
const AUDIT_COLLECTION = 'web_portal_audit_logs';

const VALID_COMPANIONS = new Set([
  'owl', 'fox', 'wolf', 'bear', 'deer', 'hare', 'crane', 'whale', 'turtle',
  'cat', 'dog', 'lion', 'swan', 'dolphin', 'butterfly',
]);

const VALID_ROOMS = new Set([
  'chalk', 'paper', 'mist', 'dusk', 'rain', 'tide', 'garden', 'aurora',
  'dune', 'forest', 'ocean', 'night', 'blossom',
]);

const VALID_THEMES = new Set(['LIGHT', 'DARK', 'SYSTEM']);

interface ProfilePatchBody {
  displayName?: unknown;
  companion?: unknown;
  room?: unknown;
  themePreference?: unknown;
}

interface ValidatedPayload {
  displayName?: string;
  companion?: string;
  room?: string;
  themePreference?: 'LIGHT' | 'DARK' | 'SYSTEM';
}

function sanitizeDisplayName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

function validatePayload(body: ProfilePatchBody): { value?: ValidatedPayload; error?: string } {
  const next: ValidatedPayload = {};

  if (body.displayName !== undefined) {
    if (typeof body.displayName !== 'string') return { error: 'displayName must be a string' };
    const displayName = sanitizeDisplayName(body.displayName);
    if (displayName.length < 2 || displayName.length > 48) return { error: 'displayName must be between 2 and 48 characters' };
    if (!/^[\p{L}\p{N}\s'.-]+$/u.test(displayName)) return { error: 'displayName contains invalid characters' };
    next.displayName = displayName;
  }

  if (body.companion !== undefined) {
    if (typeof body.companion !== 'string') return { error: 'companion must be a string' };
    const companion = body.companion.trim().toLowerCase();
    if (!VALID_COMPANIONS.has(companion)) return { error: 'Invalid companion value' };
    next.companion = companion;
  }

  if (body.room !== undefined) {
    if (typeof body.room !== 'string') return { error: 'room must be a string' };
    const room = body.room.trim().toLowerCase();
    if (!VALID_ROOMS.has(room)) return { error: 'Invalid room value' };
    next.room = room;
  }

  if (body.themePreference !== undefined) {
    if (typeof body.themePreference !== 'string') return { error: 'themePreference must be a string' };
    const theme = body.themePreference.trim().toUpperCase();
    if (!VALID_THEMES.has(theme)) return { error: 'Invalid themePreference value' };
    next.themePreference = theme as 'LIGHT' | 'DARK' | 'SYSTEM';
  }

  if (Object.keys(next).length === 0) return { error: 'No valid fields provided' };
  return { value: next };
}

async function verifySessionUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  const uid = await verifySessionUid();
  if (!uid) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  let body: ProfilePatchBody;
  try {
    body = (await req.json()) as ProfilePatchBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = validatePayload(body);
  if (validated.error || !validated.value) {
    return NextResponse.json({ ok: false, message: validated.error ?? 'Validation failed' }, { status: 400 });
  }

  const userRef = adminDb.collection(USER_COLLECTION).doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) {
    return NextResponse.json({ ok: false, message: 'User profile not found' }, { status: 404 });
  }

  const before = snap.data() ?? {};
  const patch = { ...validated.value, updatedAt: new Date() };
  await userRef.set(patch, { merge: true });

  const changed: Record<string, { before: unknown; after: unknown }> = {};
  for (const key of Object.keys(validated.value)) {
    changed[key] = { before: before[key], after: (validated.value as Record<string, unknown>)[key] };
  }

  await adminDb.collection(AUDIT_COLLECTION).add({
    action: 'PROFILE_EDIT',
    uid,
    changed,
    actor: 'WEB_PORTAL',
    ip: req.headers.get('x-forwarded-for') ?? null,
    userAgent: req.headers.get('user-agent') ?? null,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true, updated: validated.value });
}

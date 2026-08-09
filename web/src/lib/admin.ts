import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from './firebaseAdmin';

const SESSION_COOKIE = '__session';

export interface AdminUser {
  uid: string;
  email: string | null;
  admin: boolean;
}

export async function requireAdmin(): Promise<AdminUser | NextResponse> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) {
    return NextResponse.json(
      { ok: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);

    if (decoded.admin !== true) {
      return NextResponse.json(
        { ok: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      admin: true,
    };
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid session' },
      { status: 401 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

const SESSION_COOKIE = '__session';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;

interface SessionRequestBody {
  idToken?: unknown;
}

function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}

export async function POST(req: NextRequest) {
  let body: SessionRequestBody;
  try {
    body = (await req.json()) as SessionRequestBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const idToken = typeof body.idToken === 'string' ? body.idToken.trim() : '';
  if (!idToken) {
    return NextResponse.json({ ok: false, message: 'Missing idToken' }, { status: 400 });
  }

  try {
    await adminAuth.verifyIdToken(idToken, true);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
      httpOnly: true,
      secure: isProd(),
      sameSite: 'lax',
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, message: 'Unable to create session' }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax',
    path: '/',
  });
  return res;
}

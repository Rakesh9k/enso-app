'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, sendMagicLink, sendPasswordReset, sendPhoneOtp, initPhoneAuth } from '@/lib/auth';
import Link from 'next/link';

type Mode = 'email' | 'signup' | 'magic' | 'phone' | 'forgot';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (user) { router.push('/dashboard'); return null; }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'signup') { await signUpWithEmail(email, password); }
      else { await signInWithEmail(email, password); }
      router.push('/dashboard');
    } catch (err: any) { setError(err.message || 'Failed'); }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(''); setLoading(true);
    try { await signInWithGoogle(); router.push('/dashboard'); }
    catch (err: any) { setError(err.message || 'Failed'); }
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await sendMagicLink(email); setSuccess('Check your email for the sign-in link.'); }
    catch (err: any) { setError(err.message || 'Failed'); }
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await sendPasswordReset(email); setSuccess('Password reset email sent. Check your inbox.'); }
    catch (err: any) { setError(err.message || 'Failed'); }
    setLoading(false);
  }

  async function handlePhone(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const btn = document.getElementById('phone-btn');
      const verifier = initPhoneAuth(btn!);
      const conf = await sendPhoneOtp(phone, verifier);
      setConfirmation(conf);
    } catch (err: any) { setError(err.message || 'Failed'); }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await confirmation.confirm(otp); router.push('/dashboard'); }
    catch (err: any) { setError(err.message || 'Invalid OTP'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-editorial font-semibold text-text-primary">Enso</Link>
          <p className="text-sm text-text-secondary mt-2">Your quiet space</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-card bg-danger/10 text-danger text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-card bg-success/10 text-success text-sm">{success}</div>}
        {mode === 'phone' && !confirmation ? (
          <form onSubmit={handlePhone} className="space-y-4">
            <input id="phone-btn" type="tel" placeholder="+1234567890" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-button bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{loading ? 'Sending...' : 'Send OTP'}</button>
            <button type="button" onClick={() => setMode('email')} className="w-full text-sm text-text-secondary hover:text-text-primary">Back to email</button>
          </form>
        ) : mode === 'phone' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-button bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{loading ? 'Verifying...' : 'Verify'}</button>
          </form>
        ) : mode === 'forgot' ? (
          <form onSubmit={handleForgot} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-button bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <button type="button" onClick={() => setMode('email')} className="w-full text-sm text-text-secondary hover:text-text-primary">Back to sign in</button>
          </form>
        ) : mode === 'magic' ? (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-button bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{loading ? 'Sending...' : 'Send Magic Link'}</button>
            <button type="button" onClick={() => setMode('email')} className="w-full text-sm text-text-secondary hover:text-text-primary">Back to sign in</button>
          </form>
        ) : (
          <>
            <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-card border border-border bg-surface hover:bg-background text-text-primary text-sm font-medium mb-3 disabled:opacity-50">
              <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={() => { setMode('phone'); }} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-card border border-border bg-surface hover:bg-background text-text-primary text-sm font-medium mb-3 disabled:opacity-50">
              Continue with Phone
            </button>
            <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-text-disabled">or</span></div></div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-card bg-input-fill border border-border text-text-primary text-sm" required />
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-button bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}</button>
            </form>
            <div className="mt-4 flex justify-between text-xs text-text-secondary">
              <button onClick={() => setMode(mode === 'signup' ? 'email' : 'signup')}>{mode === 'signup' ? 'Sign in instead' : 'Create account'}</button>
              <button onClick={() => setMode('forgot')}>Forgot password?</button>
            </div>
            <button onClick={() => setMode('magic')} className="mt-2 w-full text-xs text-text-secondary hover:text-text-primary">Use magic link instead</button>
          </>
        )}
      </div>
    </div>
  );
}

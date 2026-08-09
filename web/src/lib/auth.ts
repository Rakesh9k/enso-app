import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithCredential,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from './firebase';

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithApple() {
  return signInWithPopup(auth, appleProvider);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function sendMagicLink(email: string) {
  const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: true,
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function initPhoneAuth(buttonElement: HTMLElement) {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, buttonElement, {
    size: 'invisible',
  });
  return recaptchaVerifier;
}

export async function sendPhoneOtp(phoneNumber: string, verifier: RecaptchaVerifier) {
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function verifyPhoneOtp(confirmationResult: any, otp: string) {
  return confirmationResult.confirm(otp);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  await fetch('/api/auth/session', { method: 'DELETE' });
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function ensureUserDoc(user: User) {
  const idToken = await user.getIdToken();
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

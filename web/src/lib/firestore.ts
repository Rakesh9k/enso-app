import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

export async function ensureUserDoc(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      subscriptionTier: 'FREE',
      currentStreak: 0,
      totalJournals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      themePreference: 'SYSTEM',
      companion: 'owl',
      room: 'chalk',
    }, { merge: true });
  }
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
}

export function subscribeToUserProfile(
  uid: string,
  callback: (data: Record<string, unknown> | null) => void
) {
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? { uid: snap.id, ...snap.data() } : null);
  });
}

export async function updateUserProfile(uid: string, data: Record<string, unknown>) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: new Date() });
}

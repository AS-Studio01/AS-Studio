import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await ensureUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signInAnonymouslyUser(): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || 'anonymous@asstudio.design',
    displayName: user.displayName || 'Guest Client',
    role: 'client',
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

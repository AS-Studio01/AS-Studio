/**
 * Authentication Context & useAuth Hook
 * ==============================================================================
 * Manages real Firebase Authentication state, Google Sign-in popup with Gmail OAuth,
 * session monitoring, admin role verification, and founder secret code access.
 * ==============================================================================
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const ADMIN_EMAILS = [
  'asstudioofficial001@gmail.com',
  'asbusinessofficial01@gmail.com',
];

export const SECRET_ADMIN_CODE = '2926 means Ayan';
const SECRET_STORAGE_KEY = 'as_studio_secret_code_authenticated';
const GMAIL_TOKEN_KEY = 'as_studio_gmail_token';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSecretCodeAdmin: boolean;
  gmailAccessToken: string | null;
  signInWithGoogle: () => Promise<UserCredential>;
  connectGmail: () => Promise<string | null>;
  loginWithSecretCode: (code: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(GMAIL_TOKEN_KEY);
    }
    return null;
  });

  const [isSecretCodeAdmin, setIsSecretCodeAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SECRET_STORAGE_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const googleCred = GoogleAuthProvider.credentialFromResult(credential);
      const token = googleCred?.accessToken || null;
      if (token) {
        setGmailAccessToken(token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(GMAIL_TOKEN_KEY, token);
        }
      }
      return credential;
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const connectGmail = async (): Promise<string | null> => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const googleCred = GoogleAuthProvider.credentialFromResult(credential);
      const token = googleCred?.accessToken || null;
      if (token) {
        setGmailAccessToken(token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(GMAIL_TOKEN_KEY, token);
        }
      }
      return token;
    } catch (error) {
      console.error('Gmail OAuth connection error:', error);
      throw error;
    }
  };

  const loginWithSecretCode = (inputCode: string): boolean => {
    const normalizedInput = inputCode.trim().toLowerCase();
    const normalizedTarget = SECRET_ADMIN_CODE.toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setIsSecretCodeAdmin(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SECRET_STORAGE_KEY, 'true');
      }
      return true;
    }
    return false;
  };

  const signOut = async (): Promise<void> => {
    setIsSecretCodeAdmin(false);
    setGmailAccessToken(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      sessionStorage.removeItem(GMAIL_TOKEN_KEY);
    }
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isEmailAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
  const isAdmin = isEmailAdmin || isSecretCodeAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSecretCodeAdmin,
        gmailAccessToken,
        signInWithGoogle,
        connectGmail,
        loginWithSecretCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}

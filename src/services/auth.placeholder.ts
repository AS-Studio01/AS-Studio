/**
 * AUTHENTICATION SERVICE PLACEHOLDER
 * ==============================================================================
 * This is a ready-to-replace placeholder module for User Authentication.
 * When you are ready to configure authentication, you can replace the dummy
 * functions below with your real Firebase Auth, Supabase Auth, NextAuth, or OAuth provider.
 * ==============================================================================
 */

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'client' | 'guest';
  createdAt: string;
  emailVerified: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface AuthPlaceholderConfig {
  provider: 'firebase' | 'supabase' | 'custom_oauth' | 'placeholder';
  authDomain: string;
  clientId: string;
  isConfigured: boolean;
}

export const AUTH_PLACEHOLDER_CONFIG: AuthPlaceholderConfig = {
  provider: 'placeholder',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'as-studio-auth.placeholder.local',
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || 'placeholder_client_id_xxxxxx',
  isConfigured: false, // Switch to true once you connect your real provider
};

// Internal in-memory simulation state for the placeholder
let currentSessionUser: AuthUser | null = null;
const authStateListeners: Array<(user: AuthUser | null) => void> = [];

/**
 * Sign in using email and password
 * PLACEHOLDER: Replace with your actual auth library's signInWithEmailAndPassword()
 */
export async function signInWithEmail(email: string, _password: string): Promise<AuthSession> {
  console.info('[AUTH PLACEHOLDER] signInWithEmail called for:', email);
  
  // Simulated placeholder response
  const dummyUser: AuthUser = {
    uid: `user_${Date.now()}`,
    email,
    displayName: email.split('@')[0],
    role: 'client',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  };

  currentSessionUser = dummyUser;
  authStateListeners.forEach((fn) => fn(dummyUser));

  return {
    token: `placeholder_jwt_${Date.now()}`,
    user: dummyUser,
    expiresAt: Date.now() + 3600 * 1000,
  };
}

/**
 * Sign up a new user
 * PLACEHOLDER: Replace with your actual auth library's createUserWithEmailAndPassword()
 */
export async function signUpWithEmail(email: string, _password: string, displayName?: string): Promise<AuthSession> {
  console.info('[AUTH PLACEHOLDER] signUpWithEmail called for:', email);

  const newUser: AuthUser = {
    uid: `user_${Date.now()}`,
    email,
    displayName: displayName || email.split('@')[0],
    role: 'client',
    createdAt: new Date().toISOString(),
    emailVerified: false,
  };

  currentSessionUser = newUser;
  authStateListeners.forEach((fn) => fn(newUser));

  return {
    token: `placeholder_jwt_${Date.now()}`,
    user: newUser,
    expiresAt: Date.now() + 3600 * 1000,
  };
}

/**
 * Sign out current session
 * PLACEHOLDER: Replace with your actual auth library's signOut()
 */
export async function signOut(): Promise<void> {
  console.info('[AUTH PLACEHOLDER] signOut called');
  currentSessionUser = null;
  authStateListeners.forEach((fn) => fn(null));
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  return currentSessionUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
  authStateListeners.push(callback);
  callback(currentSessionUser);

  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
}

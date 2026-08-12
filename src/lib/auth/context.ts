import { createContext } from 'react';
import type { AuthModalView } from './modalSlot';

/**
 * The app's normalized auth surface — everything outside src/lib/auth and
 * src/features/auth reads this, never the Cognito library directly.
 */
export interface AuthSession {
  /** False when the VITE_AUTH_* config is absent — auth is off entirely. */
  isEnabled: boolean;
  /** True while a stored session is being restored — gates wait instead of bouncing. */
  isLoading: boolean;
  isAuthenticated: boolean;
  /** The signed-in user's email; null when signed out (or auth disabled). */
  email: string | null;
  /** Open the in-app auth modal on the given view (no-op when auth is disabled). */
  signIn: (view?: AuthModalView) => void;
  /** Called by the auth modal once Cognito has persisted a fresh session. */
  notifySignedIn: (email: string | null) => void;
  /** Wipe the cached data and local session, then reload signed out. */
  signOut: () => void;
}

export const AuthSessionContext = createContext<AuthSession | null>(null);

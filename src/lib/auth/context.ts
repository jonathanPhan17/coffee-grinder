import { createContext } from 'react';

/**
 * The app's normalized auth surface — everything outside src/lib/auth reads
 * this, never react-oidc-context directly.
 */
export interface AuthSession {
  /** False when the VITE_AUTH_* config is absent — auth is off entirely. */
  isEnabled: boolean;
  /** True while a stored session is being restored — gates wait instead of redirecting. */
  isLoading: boolean;
  isAuthenticated: boolean;
  /** The signed-in user's email; null when signed out (or auth disabled). */
  email: string | null;
  /** The last sign-in/renew error, surfaced on the callback page. */
  error: Error | null;
  /** Redirect to the Cognito hosted UI. */
  signIn: () => void;
  /** Drop the local session and query cache, then end the Cognito session. */
  signOut: () => void;
}

export const AuthSessionContext = createContext<AuthSession | null>(null);

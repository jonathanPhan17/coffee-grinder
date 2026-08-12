import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { setAuthTokenGetter, setOnUnauthorized } from '@/lib/api/client';
import { queryClient } from '@/lib/api/queryClient';
import { authConfig } from './config';
import { getLiveSession, hasStoredSession, signOutLocal } from './cognito';
import { requestAuthModal } from './modalSlot';
import { AuthSessionContext, type AuthSession } from './context';

// Auth disabled (no VITE_AUTH_* config): a frozen signed-out-but-unenforced
// session, so consumers never have to know which mode they are in.
const DISABLED_SESSION: AuthSession = {
  isEnabled: false,
  isLoading: false,
  isAuthenticated: false,
  email: null,
  signIn: () => {},
  notifySignedIn: () => {},
  signOut: () => {},
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // authConfig is fixed at build time, so this branch never changes at runtime
  // and the conditional hook path below it is stable.
  if (!authConfig) {
    return <AuthSessionContext value={DISABLED_SESSION}>{children}</AuthSessionContext>;
  }
  return <EnabledAuthProvider>{children}</EnabledAuthProvider>;
}

type Status = 'restoring' | 'signedOut' | 'signedIn';

function EnabledAuthProvider({ children }: { children: ReactNode }) {
  // Only a device that has signed in before pays for a restore (and the lazy
  // Cognito chunk behind it); everyone else is signed out immediately.
  const [status, setStatus] = useState<Status>(() =>
    hasStoredSession() ? 'restoring' : 'signedOut',
  );
  const [email, setEmail] = useState<string | null>(null);

  // One-time cleanup: builds before the in-app modal stored sessions under
  // oidc-client-ts keys that nothing reads anymore.
  useEffect(() => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('oidc.'))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      // Storage denied — nothing stored, nothing to clean.
    }
  }, []);

  // Restore the stored session once. getLiveSession refreshes through the
  // ~30-day refresh token when the hour-long access token has already lapsed,
  // so "restore" works out to "log in about once a month". The ref keeps the
  // attempt single-flight across StrictMode's double effect run.
  const restoreStarted = useRef(false);
  useEffect(() => {
    if (status !== 'restoring' || restoreStarted.current) return;
    restoreStarted.current = true;
    getLiveSession()
      .then((tokens) => {
        if (tokens) {
          setEmail(tokens.email || null);
          setStatus('signedIn');
        } else {
          setStatus('signedOut');
        }
      })
      // Even an import failure (offline chunk load) just means signed out.
      .catch(() => setStatus('signedOut'));
  }, [status]);

  // The axios client can't import auth code (circular import), so it exposes
  // function slots. The getter reads Cognito's own store per request — by the
  // time the modal reports a sign-in the tokens are already persisted, so no
  // React state ordering can hand a request a stale session.
  useEffect(() => {
    setAuthTokenGetter(async () => (await getLiveSession())?.accessToken ?? null);
    return () => setAuthTokenGetter(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      // The session is dead (revoked, or the refresh token aged out): wipe
      // this user's cached data and drop to signed-out chrome. RequireAuth
      // swaps the page for the sign-in gate, whose modal starts fresh —
      // no redirect, so several queries failing at once collapse harmlessly.
      queryClient.clear();
      void signOutLocal();
      setEmail(null);
      setStatus('signedOut');
    });
    return () => setOnUnauthorized(null);
  }, []);

  const value = useMemo<AuthSession>(
    () => ({
      isEnabled: true,
      isLoading: status === 'restoring',
      isAuthenticated: status === 'signedIn',
      email,
      signIn: (view) => requestAuthModal(view),
      notifySignedIn: (freshEmail) => {
        setEmail(freshEmail);
        setStatus('signedIn');
      },
      signOut: () => {
        // Clear the cache first so nothing of this user survives into the
        // next session, then the stored tokens. The full reload guarantees no
        // in-memory user state outlives the session; unlike the old flow
        // there is no hosted-UI cookie to end, so '/' is the whole journey.
        queryClient.clear();
        void signOutLocal().finally(() => window.location.assign('/'));
      },
    }),
    [status, email],
  );

  return <AuthSessionContext value={value}>{children}</AuthSessionContext>;
}

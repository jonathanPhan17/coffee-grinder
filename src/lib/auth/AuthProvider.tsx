import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AuthProvider as OidcAuthProvider, useAuth } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import { setAuthTokenGetter, setOnUnauthorized } from '@/lib/api/client';
import { queryClient } from '@/lib/api/queryClient';
import { authConfig, type AuthConfig } from './config';
import { AuthSessionContext, type AuthSession } from './context';

// Auth disabled (no VITE_AUTH_* config): a frozen signed-out-but-unenforced
// session, so consumers never have to know which mode they are in.
const DISABLED_SESSION: AuthSession = {
  isEnabled: false,
  isLoading: false,
  isAuthenticated: false,
  email: null,
  error: null,
  signIn: () => {},
  signOut: () => {},
};

// localStorage instead of the lib's default sessionStorage so the session
// survives new tabs and browser restarts; together with automatic silent renew
// against the ~30-day refresh token that works out to "log in about once a
// month" instead of once per tab.
const userStore = new WebStorageStateStore({ store: window.localStorage });

// Once the hosted UI redirects back, drop ?code=…&state=… from the URL so a
// refresh (or bookmark) doesn't replay the single-use code exchange.
function onSigninCallback() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!authConfig) {
    return <AuthSessionContext value={DISABLED_SESSION}>{children}</AuthSessionContext>;
  }
  return (
    <OidcAuthProvider
      authority={authConfig.authority}
      client_id={authConfig.clientId}
      redirect_uri={`${window.location.origin}/auth/callback`}
      scope="openid email profile"
      userStore={userStore}
      automaticSilentRenew
      onSigninCallback={onSigninCallback}
    >
      <Bridge config={authConfig}>{children}</Bridge>
    </OidcAuthProvider>
  );
}

/** Maps react-oidc-context's state into the app's AuthSession shape. */
function Bridge({ config, children }: { config: AuthConfig; children: ReactNode }) {
  const auth = useAuth();

  // The axios client can't import auth code (circular import), so it exposes
  // function slots. Re-register whenever the user object — and with it the
  // access token — changes (login, silent renew, logout).
  useEffect(() => {
    setAuthTokenGetter(() => auth.user?.access_token ?? null);
    return () => setAuthTokenGetter(null);
  }, [auth.user]);

  // A restored session whose access token already expired reports
  // isAuthenticated=false, and the library's silent renew never fires for it
  // (the expiring timer is cancelled when the token is already past expiry) —
  // but the ~30-day refresh token still in storage can mint a fresh one. Try
  // exactly once before falling through to the sign-in gate, and surface the
  // attempt as loading so the gate doesn't flash mid-renew.
  const silentAttempted = useRef(false);
  const [renewState, setRenewState] = useState<'idle' | 'pending' | 'done'>('idle');
  const canSilentRenew =
    !auth.isLoading && !auth.isAuthenticated && Boolean(auth.user?.refresh_token);
  useEffect(() => {
    if (!canSilentRenew || silentAttempted.current) return;
    silentAttempted.current = true;
    setRenewState('pending');
    void auth
      .signinSilent()
      .catch(() => null) // failure just means the sign-in gate shows
      .finally(() => setRenewState('done'));
  }, [canSilentRenew, auth]);

  // A page can fire several queries at once; when the session dies they all
  // 401 together. The single-flight ref lets only the first one clear the
  // cache and start the re-login redirect.
  const redirecting = useRef(false);
  useEffect(() => {
    setOnUnauthorized(() => {
      if (redirecting.current) return;
      redirecting.current = true;
      queryClient.clear();
      auth.signinRedirect().catch(() => {
        // A failed redirect (e.g. metadata fetch while offline) must re-arm
        // the guard, or every later 401 is silently ignored until a reload.
        redirecting.current = false;
      });
    });
    return () => setOnUnauthorized(null);
  }, [auth]);

  const value = useMemo<AuthSession>(
    () => ({
      isEnabled: true,
      isLoading: auth.isLoading || (canSilentRenew && renewState !== 'done'),
      isAuthenticated: auth.isAuthenticated,
      email: auth.user?.profile.email ?? null,
      error: auth.error ?? null,
      signIn: () => void auth.signinRedirect(),
      signOut: () => {
        // Clear the cache first so nothing of this user survives into the next
        // session, then drop the stored tokens before leaving the page.
        queryClient.clear();
        void auth.removeUser().finally(() => {
          // Cognito's discovery metadata has no end_session_endpoint, so the
          // hosted-UI logout URL is built by hand. logout_uri must be one of
          // the app client's registered sign-out URLs — the backend registers
          // the bare origin.
          window.location.assign(
            `${config.domain}/logout?client_id=${config.clientId}&logout_uri=${encodeURIComponent(window.location.origin)}`,
          );
        });
      },
    }),
    [auth, config, canSilentRenew, renewState],
  );

  return <AuthSessionContext value={value}>{children}</AuthSessionContext>;
}

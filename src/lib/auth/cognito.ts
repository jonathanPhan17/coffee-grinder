import type {
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { authConfig } from './config';

/**
 * Thin promise wrappers around amazon-cognito-identity-js — the in-app
 * replacement for the retired hosted-UI redirect. The library speaks SRP
 * (the only user-facing auth flow enabled on the app client; the password
 * itself never crosses the wire) and persists sessions to localStorage under
 * its own `CognitoIdentityServiceProvider.<clientId>.*` keys.
 *
 * The library is dynamically imported so it lands in a lazy chunk: a
 * signed-out visitor reading the landing page never downloads it — it loads
 * when the auth modal opens or when a previously signed-in device restores
 * its session at boot.
 */

export interface AuthTokens {
  /** Sent to the API as the Bearer token (same as the hosted-UI flow did). */
  accessToken: string;
  /** From the id token payload; '' when the pool omits it. */
  email: string;
}

type CognitoLib = typeof import('amazon-cognito-identity-js');

let libPromise: Promise<CognitoLib> | null = null;
function lib(): Promise<CognitoLib> {
  return (libPromise ??= import('amazon-cognito-identity-js'));
}

/** Warm the lazy chunk (called when the auth modal opens, before any submit). */
export function preloadAuthLib(): void {
  void lib().catch(() => {
    // Allow a retry on the next call instead of caching the failure.
    libPromise = null;
  });
}

function config() {
  if (!authConfig) throw new Error('Auth is disabled — no VITE_AUTH_* config.');
  return authConfig;
}

let poolInstance: CognitoUserPool | null = null;
async function pool(): Promise<CognitoUserPool> {
  const { CognitoUserPool } = await lib();
  return (poolInstance ??= new CognitoUserPool({
    UserPoolId: config().userPoolId,
    ClientId: config().clientId,
  }));
}

async function userFor(email: string): Promise<CognitoUser> {
  const { CognitoUser } = await lib();
  return new CognitoUser({ Username: email, Pool: await pool() });
}

/**
 * Synchronous, import-free check for a stored session — the boot path uses it
 * to decide whether restoring (and the chunk download it implies) is worth
 * starting at all.
 */
export function hasStoredSession(): boolean {
  if (!authConfig) return false;
  try {
    return (
      localStorage.getItem(
        `CognitoIdentityServiceProvider.${authConfig.clientId}.LastAuthUser`,
      ) !== null
    );
  } catch {
    return false;
  }
}

// Concurrent callers (a page firing several queries) share one refresh instead
// of each spending a network round trip when the access token has lapsed.
let liveSessionInflight: Promise<AuthTokens | null> | null = null;

/**
 * The current session's tokens, transparently refreshed through the stored
 * ~30-day refresh token when the hour-long access token has expired. Resolves
 * null when signed out or when the refresh token itself is dead.
 */
export function getLiveSession(): Promise<AuthTokens | null> {
  if (!hasStoredSession()) return Promise.resolve(null);
  return (liveSessionInflight ??= (async () => {
    const user = (await pool()).getCurrentUser();
    if (!user) return null;
    return new Promise<AuthTokens | null>((resolve) => {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        resolve(err || !session?.isValid() ? null : tokensFrom(session));
      });
    });
  })().finally(() => {
    liveSessionInflight = null;
  }));
}

function tokensFrom(session: CognitoUserSession): AuthTokens {
  return {
    accessToken: session.getAccessToken().getJwtToken(),
    email: (session.getIdToken().payload.email as string | undefined) ?? '',
  };
}

function unsupportedChallenge(): Error {
  const err = new Error('This account needs a sign-in step the app does not support yet.');
  err.name = 'UnsupportedChallengeError';
  return err;
}

/** SRP sign-in. On success the library has already persisted the session. */
export async function signInWithPassword(email: string, password: string): Promise<AuthTokens> {
  const { AuthenticationDetails } = await lib();
  const user = await userFor(email);
  return new Promise((resolve, reject) => {
    user.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
      onSuccess: (session) => resolve(tokensFrom(session)),
      onFailure: reject,
      // The pool has no MFA and self-signup users are never provisioned into
      // FORCE_CHANGE_PASSWORD, so these callbacks mean the pool's config
      // changed out from under the app — fail loud rather than hang.
      newPasswordRequired: () => reject(unsupportedChallenge()),
      mfaRequired: () => reject(unsupportedChallenge()),
      totpRequired: () => reject(unsupportedChallenge()),
    });
  });
}

/** Resolves true when the pool auto-confirmed (no emailed code needed). */
export async function signUpWithPassword(email: string, password: string): Promise<boolean> {
  const { CognitoUserAttribute } = await lib();
  const p = await pool();
  return new Promise((resolve, reject) => {
    p.signUp(
      email,
      password,
      [new CognitoUserAttribute({ Name: 'email', Value: email })],
      [],
      (err, result) => (err ? reject(err) : resolve(result?.userConfirmed ?? false)),
    );
  });
}

export async function confirmSignUp(email: string, code: string): Promise<void> {
  const user = await userFor(email);
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => (err ? reject(err) : resolve()));
  });
}

export async function resendSignUpCode(email: string): Promise<void> {
  const user = await userFor(email);
  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err) => (err ? reject(err) : resolve()));
  });
}

/** Emails a reset code. The pool hides whether the account exists. */
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await userFor(email);
  return new Promise((resolve, reject) => {
    user.forgotPassword({
      // Modern pools deliver the code and fire inputVerificationCode; the
      // bare onSuccess only fires on legacy flows. Either way: proceed.
      onSuccess: () => resolve(),
      inputVerificationCode: () => resolve(),
      onFailure: reject,
    });
  });
}

export async function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  const user = await userFor(email);
  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: reject,
    });
  });
}

/** Drop the locally stored session (no Cognito round trip, no page leave). */
export async function signOutLocal(): Promise<void> {
  if (!hasStoredSession()) return;
  (await pool()).getCurrentUser()?.signOut();
}

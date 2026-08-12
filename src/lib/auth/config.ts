/**
 * Cognito configuration, read from build-time env:
 *
 * - `VITE_AUTH_AUTHORITY` — the user-pool OIDC issuer,
 *   https://cognito-idp.<region>.amazonaws.com/<poolId>
 * - `VITE_AUTH_CLIENT_ID` — the user-pool app-client id
 * - `VITE_AUTH_DOMAIN` — the hosted-UI base URL. The in-app SRP flow never
 *   touches it; it is kept for a future federated (Google) sign-in redirect.
 *
 * Contract: `authConfig` is null unless the authority and client id are both
 * set. Null means auth is disabled and the app behaves exactly as it did
 * before auth existed — the expected local-dev mode until the values land
 * from the backend stack outputs.
 */
export interface AuthConfig {
  authority: string;
  clientId: string;
  /** The trailing segment of the authority, e.g. us-west-1_iFkiXYQjC. */
  userPoolId: string;
  domain?: string;
}

// Baked into the bundle at build time and visible to every browser — these are
// public identifiers, not secrets.
const authority: string | undefined = import.meta.env.VITE_AUTH_AUTHORITY;
const clientId: string | undefined = import.meta.env.VITE_AUTH_CLIENT_ID;
const domain: string | undefined = import.meta.env.VITE_AUTH_DOMAIN;

const userPoolId = authority?.split('/').filter(Boolean).pop();

export const authConfig: AuthConfig | null =
  authority && clientId && userPoolId
    ? { authority, clientId, userPoolId, domain: domain || undefined }
    : null;

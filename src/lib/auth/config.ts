/**
 * Cognito hosted-UI configuration, read from build-time env:
 *
 * - `VITE_AUTH_AUTHORITY` — the user-pool OIDC issuer,
 *   https://cognito-idp.<region>.amazonaws.com/<poolId>
 * - `VITE_AUTH_CLIENT_ID` — the user-pool app-client id
 * - `VITE_AUTH_DOMAIN` — the hosted-UI base URL,
 *   e.g. https://coffeegrinder-dev.auth.us-west-1.amazoncognito.com
 *
 * Contract: `authConfig` is null unless ALL three are set. Null means auth is
 * disabled and the app behaves exactly as it did before auth existed — the
 * expected local-dev mode until the values land from the backend stack outputs.
 */
export interface AuthConfig {
  authority: string;
  clientId: string;
  domain: string;
}

// Baked into the bundle at build time and visible to every browser — these are
// public identifiers, not secrets.
const authority = import.meta.env.VITE_AUTH_AUTHORITY;
const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;
const domain = import.meta.env.VITE_AUTH_DOMAIN;

export const authConfig: AuthConfig | null =
  authority && clientId && domain ? { authority, clientId, domain } : null;

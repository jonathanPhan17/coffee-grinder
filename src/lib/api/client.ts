import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

// Auth is wired through function slots the auth provider fills in at runtime —
// importing auth code here directly would be a circular import (auth code
// imports this client). Both stay null when auth is disabled.
let getToken: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

/** Registered by the auth provider; pass null to detach (requests go out bare). */
export function setAuthTokenGetter(fn: (() => string | null) | null) {
  getToken = fn;
}

/** Registered by the auth provider; invoked on every 401 response. */
export function setOnUnauthorized(fn: (() => void) | null) {
  onUnauthorized = fn;
}

// Note this only runs for requests through `client` — the S3 presigned PUT in
// endpoints.ts deliberately uses bare axios and must stay token-free (the
// presign signature covers the exact headers; an Authorization header would
// make S3 reject the upload).
client.interceptors.request.use((config) => {
  const token = getToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Expired/missing session: hand off to the auth provider (which redirects
    // to re-login), but still reject so callers see the failure.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

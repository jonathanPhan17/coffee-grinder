import { Navigate } from 'react-router';

/**
 * Legacy landing spot for the retired hosted-UI redirect flow — sign-in now
 * happens in the in-app modal. The route survives only so stale bookmarks and
 * old sign-in emails land home instead of on a 404.
 */
export default function AuthCallbackPage() {
  return <Navigate to="/" replace />;
}

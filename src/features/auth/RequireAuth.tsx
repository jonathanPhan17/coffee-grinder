import { Outlet } from 'react-router';
import { useAuthSession } from '@/lib/auth/useAuthSession';
import { SignInGate } from './SignInGate';

/** Layout route wrapping every screen that talks to the API. */
export function RequireAuth() {
  const { isEnabled, isLoading, isAuthenticated } = useAuthSession();

  // No auth config (local dev) — the app behaves exactly as it did pre-auth.
  if (!isEnabled) return <Outlet />;
  // On a refresh the stored session is still being restored — wait, don't bounce.
  if (isLoading) return null;
  if (!isAuthenticated) return <SignInGate />;
  return <Outlet />;
}

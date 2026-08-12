import { Navigate } from 'react-router';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { useAuthSession } from '@/lib/auth/useAuthSession';

/**
 * Landing spot for the hosted-UI redirect. The provider does the actual code
 * exchange the moment the URL carries ?code=…&state=… — this page only shows
 * its progress and forwards home when it settles.
 */
export default function AuthCallbackPage() {
  const { isEnabled, isLoading, error, signIn } = useAuthSession();

  // Auth disabled — there is no exchange to wait for.
  if (!isEnabled) return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <SpinnerGapIcon size={28} className="animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Sign-in didn’t finish.</h1>
        <p className="max-w-md text-text-secondary">
          Something went wrong completing your sign-in. Give it another shot.
        </p>
        <Button onClick={signIn}>Try again</Button>
      </div>
    );
  }

  // Settled without an error: signed in (or landed here with no pending
  // exchange) — either way home decides what to show next.
  return <Navigate to="/" replace />;
}

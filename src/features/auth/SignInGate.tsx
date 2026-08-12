import { Link } from 'react-router';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthSession } from '@/lib/auth/useAuthSession';

/** Signed-out gate for deep links into the app. */
export function SignInGate() {
  const { signIn } = useAuthSession();

  return (
    <div className="flex justify-center py-24">
      <Card className="flex w-full max-w-sm flex-col items-center gap-4 py-10 text-center">
        <BrandMark className="size-12" />
        <h1 className="font-display text-2xl font-semibold">Welcome to Coffee Grinder</h1>
        <p className="text-text-secondary">Sign in to start grinding your job hunt.</p>
        <Button onClick={signIn}>Sign in</Button>
        <p className="text-xs text-text-secondary">
          By signing in you agree to the{' '}
          <Link to="/terms" className="underline hover:text-text">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-text">
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}

import { CoffeeIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthSession } from '@/lib/auth/useAuthSession';

/** Interim signed-out landing — replaced by the marketing page when it ships. */
export function SignInGate() {
  const { signIn } = useAuthSession();

  return (
    <div className="flex justify-center py-24">
      <Card className="flex w-full max-w-sm flex-col items-center gap-4 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-lg bg-accent text-white">
          <CoffeeIcon size={26} weight="fill" />
        </span>
        <h1 className="font-display text-2xl font-semibold">Welcome to Coffee Grinder</h1>
        <p className="text-text-secondary">Sign in to start grinding your job hunt.</p>
        <Button onClick={signIn}>Sign in</Button>
      </Card>
    </div>
  );
}

import { Link } from 'react-router';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-accent">
        404
      </span>
      <h1 className="text-3xl font-semibold">This cup is empty.</h1>
      <p className="max-w-md text-text-secondary">
        The page you’re looking for doesn’t exist. Let’s get you back to the grind.
      </p>
      <Link to="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}

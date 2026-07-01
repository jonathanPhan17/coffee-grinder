import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { NavBar } from './NavBar';

function RouteFallback() {
  return (
    <div className="flex justify-center py-24">
      <SpinnerGapIcon size={28} className="animate-spin text-accent" />
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col bg-bg text-text">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {/* key=pathname remounts the boundary on navigation, clearing a crashed screen */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

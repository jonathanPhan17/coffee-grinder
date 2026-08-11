import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { cn } from '@/lib/utils/cn';
import { NavBar } from './NavBar';
import { ScrollToTop } from './ScrollToTop';

function RouteFallback() {
  return (
    <div className="flex justify-center py-24">
      <SpinnerGapIcon size={28} className="animate-spin text-accent" />
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  // The board is a viewport-fit workspace: it locks the page to the window height
  // and spans the full width, with scrolling happening inside its columns. Every
  // other screen stays a centered reading column that scrolls the page as usual.
  const fitViewport = pathname === '/board';

  return (
    <div className={cn('flex flex-col bg-bg text-text', fitViewport ? 'h-svh' : 'min-h-svh')}>
      <ScrollToTop />
      <NavBar />
      {/* key=pathname remounts the subtree on navigation — replays the enter
          animation and clears a crashed ErrorBoundary. */}
      <main
        key={pathname}
        className={cn(
          'w-full flex-1 motion-safe:animate-page-in',
          fitViewport ? 'flex min-h-0 flex-col px-6 py-6' : 'mx-auto max-w-6xl px-6 py-8',
        )}
      >
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

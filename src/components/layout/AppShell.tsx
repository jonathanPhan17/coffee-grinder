import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { NavBar } from './NavBar';

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col bg-bg text-text">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {/* key=pathname remounts the boundary on navigation, clearing a crashed screen */}
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}

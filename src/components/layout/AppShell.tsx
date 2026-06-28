import { Outlet } from 'react-router';
import { NavBar } from './NavBar';

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-bg text-text">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

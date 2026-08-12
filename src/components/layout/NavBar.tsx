import { useState } from 'react';
import { ListIcon, MoonIcon, SignOutIcon, SunIcon, XIcon } from '@phosphor-icons/react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils/cn';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/lib/theme/useTheme';
import { useAuthSession } from '@/lib/auth/useAuthSession';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/results', label: 'Results', end: false },
  { to: '/board', label: 'Pipeline', end: false },
];

export function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const { isEnabled, isLoading, isAuthenticated, email, signIn, signOut } = useAuthSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  // Signed out (auth on): app links lead nowhere useful, so the chrome offers
  // Sign in instead — this serves the landing and deep-linked SignInGate alike.
  const showApp = !isEnabled || isAuthenticated;
  // Only a real signed-in identity gets an account cluster: signed-out is the
  // SignInGate's job, and auth-disabled local dev shows no fake persona.
  const showAccount = isEnabled && isAuthenticated;
  const initial = email ? email.split('@')[0].charAt(0).toUpperCase() : '?';

  const ThemeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to latte (light)' : 'Switch to dark roast'}
      className="grid size-9 place-items-center rounded-full text-text-secondary transition-colors hover:bg-elevated hover:text-text"
    >
      {theme === 'dark' ? <SunIcon size={18} weight="bold" /> : <MoonIcon size={18} weight="bold" />}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand — never wraps; wordmark hides on the narrowest screens, so the
            link carries its name for when the mascot stands alone */}
        <NavLink
          to="/"
          onClick={closeMenu}
          aria-label="Coffee Grinder — home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <BrandMark className="size-9 shrink-0" />
          <span className="hidden whitespace-nowrap font-display text-lg font-semibold xs:inline">
            Coffee Grinder
          </span>
        </NavLink>

        {/* Desktop nav */}
        {showApp && (
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-elevated hover:text-text',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right cluster */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {ThemeToggle}
          {/* Not while restoring a stored session — a signed-in user refreshing
              must not see a Sign in flash (same wait RequireAuth applies). */}
          {!showApp && !isLoading && (
            <Button size="sm" onClick={signIn}>
              Sign in
            </Button>
          )}
          {showAccount && (
            <>
              <span
                title={email ?? undefined}
                className="hidden size-9 place-items-center rounded-full bg-elevated text-sm font-semibold md:grid"
              >
                {initial}
              </span>
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                className="hidden size-9 place-items-center rounded-full text-text-secondary transition-colors hover:bg-elevated hover:text-text md:grid"
              >
                <SignOutIcon size={18} weight="bold" />
              </button>
            </>
          )}
          {/* Hamburger — mobile only */}
          {showApp && (
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="grid size-9 place-items-center rounded-md text-text-secondary transition-colors hover:bg-elevated hover:text-text md:hidden"
            >
              {mobileOpen ? <XIcon size={20} weight="bold" /> : <ListIcon size={20} weight="bold" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {showApp && mobileOpen && (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-elevated hover:text-text',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {showAccount && (
              <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-elevated text-xs font-semibold">
                  {initial}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                  className="shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-elevated hover:text-text"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { useState } from 'react';
import { CoffeeIcon, ListIcon, MoonIcon, SunIcon, XIcon } from '@phosphor-icons/react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/theme/useTheme';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/results', label: 'Results', end: false },
  { to: '/board', label: 'Pipeline', end: false },
];

export function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

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
        {/* Brand — never wraps; wordmark hides on the narrowest screens */}
        <NavLink to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-white">
            <CoffeeIcon size={20} weight="fill" />
          </span>
          <span className="hidden whitespace-nowrap font-display text-lg font-semibold xs:inline">
            Coffee Grinder
          </span>
        </NavLink>

        {/* Desktop nav */}
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

        {/* Right cluster */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {ThemeToggle}
          <span className="hidden size-9 place-items-center rounded-full bg-elevated text-sm font-semibold md:grid">
            AR
          </span>
          {/* Hamburger — mobile only */}
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
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
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
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <span className="grid size-8 place-items-center rounded-full bg-elevated text-xs font-semibold">
                AR
              </span>
              <span className="text-sm text-text-secondary">Alex Rivera</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

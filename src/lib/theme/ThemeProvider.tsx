import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './context';

const STORAGE_KEY = 'cg-theme';

// Latte is the default; dark roast only when explicitly chosen. Must agree
// with the pre-paint script in index.html, which applies the class before
// first paint so neither theme ever flashes into the other.
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'latte';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('latte', theme === 'latte');
  // Keep the browser-chrome color on the page background — index.html ships the
  // latte value, which is wrong once a dark-roast user's theme is restored.
  // Read the token post-toggle so this can never drift from index.css.
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  if (bg) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'dark' ? 'latte' : 'dark')),
    [],
  );

  return (
    <ThemeContext value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

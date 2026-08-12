import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { setAuthModalOpener, type AuthModalView } from '@/lib/auth/modalSlot';
import { useAuthSession } from '@/lib/auth/useAuthSession';

// The modal (forms, Cognito wrappers) rides in a lazy chunk paid for on first
// open, not on every landing-page visit.
const AuthModal = lazy(() => import('./AuthModal'));

/**
 * Mounts the auth modal and registers its opener into the modal slot, which is
 * how `AuthSession.signIn()` reaches it from outside the router. Lives inside
 * BrowserRouter (the modal renders <Link>s) wrapping the whole route tree.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isEnabled, isAuthenticated } = useAuthSession();
  const [view, setView] = useState<AuthModalView | null>(null);

  useEffect(() => {
    if (!isEnabled) return;
    setAuthModalOpener((requested) => setView(requested));
    return () => setAuthModalOpener(null);
  }, [isEnabled]);

  // Never over a signed-in session — the flip after a successful sign-in also
  // unmounts the modal even before its onClose lands.
  const open = view !== null && !isAuthenticated;

  return (
    <>
      {children}
      {open && (
        <Suspense fallback={null}>
          <AuthModal initialView={view} onClose={() => setView(null)} />
        </Suspense>
      )}
    </>
  );
}

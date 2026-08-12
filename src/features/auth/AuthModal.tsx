import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { EyeIcon, EyeSlashIcon, SpinnerGapIcon, XIcon } from '@phosphor-icons/react';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  confirmPasswordReset,
  confirmSignUp,
  preloadAuthLib,
  requestPasswordReset,
  resendSignUpCode,
  signInWithPassword,
  signUpWithPassword,
} from '@/lib/auth/cognito';
import type { AuthModalView } from '@/lib/auth/modalSlot';
import { useAuthSession } from '@/lib/auth/useAuthSession';
import { friendlyAuthError } from './authErrors';

/**
 * The in-app sign-in/sign-up dialog: dimmed, blurred page behind a focused
 * panel — the URL never leaves the site. Talks SRP to Cognito through
 * lib/auth/cognito and reports a completed sign-in to the auth provider,
 * which flips the whole app to its signed-in face without a navigation.
 */

type View = AuthModalView | 'confirm' | 'forgot' | 'reset';

const COPY: Record<View, { title: string; sub: (email: string) => string }> = {
  signin: { title: 'Welcome back', sub: () => 'Sign in to keep grinding.' },
  signup: { title: 'Create your account', sub: () => 'Free while in beta — no card needed.' },
  confirm: { title: 'Check your email', sub: (email) => `We sent a 6-digit code to ${email}.` },
  forgot: { title: 'Reset your password', sub: () => 'We’ll email you a reset code.' },
  reset: { title: 'Set a new password', sub: (email) => `Enter the code we sent to ${email}.` },
};

export default function AuthModal({
  initialView,
  onClose,
}: {
  initialView: AuthModalView;
  onClose: () => void;
}) {
  const { notifySignedIn } = useAuthSession();
  const ids = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>(initialView);
  const [email, setEmail] = useState('');
  // Kept across the signup → confirm hop so a confirmed account signs in
  // without retyping; lives only in component state and dies with the modal.
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Warm the lazy Cognito chunk while the user types, so the first submit
  // spends its time on the network round trip only.
  useEffect(() => preloadAuthLib(), []);

  // Freeze the page behind the dialog without the reflow jump of a vanishing
  // scrollbar: pad the body by exactly the gutter the lock removes.
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Focus lives inside the dialog while it is open and returns to the control
  // that opened it after. autoFocus on each view's first field handles the
  // initial placement; the panel itself is the fallback target.
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();
    return () => prior?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Resend-code cooldown tick.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function switchView(next: View) {
    setError(null);
    setNotice(null);
    setCode('');
    setView(next);
  }

  function goToConfirm(message: string) {
    switchView('confirm');
    setNotice(message);
    setCooldown(30);
  }

  function completeSignIn(sessionEmail: string) {
    notifySignedIn(sessionEmail || email || null);
    onClose();
  }

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  function submitSignIn(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      try {
        const tokens = await signInWithPassword(email, password);
        completeSignIn(tokens.email);
      } catch (err) {
        if ((err as { code?: string; name?: string }).code === 'UserNotConfirmedException' ||
            (err as { name?: string }).name === 'UserNotConfirmedException') {
          // The account exists but the email was never confirmed — push a
          // fresh code and take them straight to the confirm step.
          await resendSignUpCode(email).catch(() => {});
          goToConfirm(`This email still needs confirming. We sent a new code to ${email}.`);
          return;
        }
        setError(friendlyAuthError(err));
      }
    });
  }

  function submitSignUp(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      try {
        const autoConfirmed = await signUpWithPassword(email, password);
        if (autoConfirmed) {
          const tokens = await signInWithPassword(email, password);
          completeSignIn(tokens.email);
          return;
        }
        goToConfirm(`We emailed a 6-digit code to ${email}.`);
      } catch (err) {
        setError(friendlyAuthError(err));
      }
    });
  }

  function submitConfirm(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      try {
        await confirmSignUp(email, code);
      } catch (err) {
        setError(friendlyAuthError(err));
        return;
      }
      // Confirmed — finish the sign-in with the password kept from signup.
      // If it is gone (or wrong by now), fall back to the sign-in form.
      try {
        if (!password) throw new Error('no stored password');
        const tokens = await signInWithPassword(email, password);
        completeSignIn(tokens.email);
      } catch {
        switchView('signin');
        setNotice('Email confirmed. Sign in to continue.');
      }
    });
  }

  function resendCode() {
    void run(async () => {
      try {
        await resendSignUpCode(email);
        setNotice(`New code sent to ${email}.`);
        setCooldown(30);
      } catch (err) {
        setError(friendlyAuthError(err));
      }
    });
  }

  function submitForgot(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      try {
        await requestPasswordReset(email);
        switchView('reset');
        setNotice(`If an account exists for ${email}, a code is on its way.`);
      } catch (err) {
        setError(friendlyAuthError(err));
      }
    });
  }

  function submitReset(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      try {
        await confirmPasswordReset(email, code, newPassword);
      } catch (err) {
        setError(friendlyAuthError(err));
        return;
      }
      try {
        const tokens = await signInWithPassword(email, newPassword);
        completeSignIn(tokens.email);
      } catch {
        switchView('signin');
        setNotice('Password updated. Sign in to continue.');
      }
    });
  }

  const copy = COPY[view];

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dim and blur the page behind — separate layer so the blur cannot
          soften the panel; pointer-events pass through to the click-away
          wrapper. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-black/50 backdrop-blur-sm motion-safe:animate-overlay-in"
      />
      <div
        className="flex min-h-full items-center justify-center p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          tabIndex={-1}
          className="relative w-full max-w-md rounded-lg border border-border bg-elevated p-6 shadow-2xl outline-none motion-safe:animate-modal-in sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface hover:text-text"
          >
            <XIcon size={18} weight="bold" />
          </button>

          <div className="flex flex-col items-center gap-1 text-center">
            <BrandMark className="size-11" />
            <h2 id="auth-modal-title" className="mt-2 font-display text-2xl font-semibold">
              {copy.title}
            </h2>
            <p className="text-sm text-text-secondary">{copy.sub(email)}</p>
          </div>

          {view === 'signin' && (
            <form onSubmit={submitSignIn} className="mt-6 flex flex-col gap-4">
              <Field id={`${ids}-email`} label="Email">
                <Input
                  id={`${ids}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field id={`${ids}-password`} label="Password">
                <PasswordInput
                  id={`${ids}-password`}
                  autoComplete="current-password"
                  value={password}
                  onChange={setPassword}
                />
                <button
                  type="button"
                  onClick={() => switchView('forgot')}
                  className="self-end text-sm font-semibold text-accent-hover hover:underline"
                >
                  Forgot password?
                </button>
              </Field>
              <Banners error={error} notice={notice} />
              <SubmitButton busy={busy}>Sign in</SubmitButton>
              <FooterSwitch
                prompt="New to Coffee Grinder?"
                action="Create an account"
                onClick={() => switchView('signup')}
              />
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={submitSignUp} className="mt-6 flex flex-col gap-4">
              <Field id={`${ids}-email`} label="Email">
                <Input
                  id={`${ids}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field id={`${ids}-password`} label="Password" hint="At least 8 characters.">
                <PasswordInput
                  id={`${ids}-password`}
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                />
              </Field>
              <Banners error={error} notice={notice} />
              <SubmitButton busy={busy}>Create free account</SubmitButton>
              <p className="text-center text-xs text-text-secondary">
                By signing up you agree to the{' '}
                <Link to="/terms" onClick={onClose} className="underline hover:text-text">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" onClick={onClose} className="underline hover:text-text">
                  Privacy Policy
                </Link>
                .
              </p>
              <FooterSwitch
                prompt="Already have an account?"
                action="Sign in"
                onClick={() => switchView('signin')}
              />
            </form>
          )}

          {view === 'confirm' && (
            <form onSubmit={submitConfirm} className="mt-6 flex flex-col gap-4">
              <Field id={`${ids}-code`} label="Confirmation code">
                <Input
                  id={`${ids}-code`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center font-display text-lg font-semibold tracking-[0.4em]"
                />
              </Field>
              <Banners error={error} notice={notice} />
              <SubmitButton busy={busy}>Confirm email</SubmitButton>
              <p className="text-center text-sm text-text-secondary">
                Didn’t get it?{' '}
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={busy || cooldown > 0}
                  className="font-semibold text-accent-hover hover:underline disabled:cursor-default disabled:opacity-60 disabled:hover:no-underline"
                >
                  {cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
                </button>
              </p>
              <FooterSwitch
                prompt="Wrong email?"
                action="Start over"
                onClick={() => switchView('signup')}
              />
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={submitForgot} className="mt-6 flex flex-col gap-4">
              <Field id={`${ids}-email`} label="Email">
                <Input
                  id={`${ids}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Banners error={error} notice={notice} />
              <SubmitButton busy={busy}>Send reset code</SubmitButton>
              <FooterSwitch
                prompt="Remembered it?"
                action="Sign in"
                onClick={() => switchView('signin')}
              />
            </form>
          )}

          {view === 'reset' && (
            <form onSubmit={submitReset} className="mt-6 flex flex-col gap-4">
              <Field id={`${ids}-code`} label="Reset code">
                <Input
                  id={`${ids}-code`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center font-display text-lg font-semibold tracking-[0.4em]"
                />
              </Field>
              <Field id={`${ids}-new-password`} label="New password" hint="At least 8 characters.">
                <PasswordInput
                  id={`${ids}-new-password`}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
              </Field>
              <Banners error={error} notice={notice} />
              <SubmitButton busy={busy}>Update password</SubmitButton>
              <FooterSwitch
                prompt="Didn’t get a code?"
                action="Send it again"
                onClick={() => switchView('forgot')}
              />
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder="••••••••"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-11"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded text-text-secondary transition-colors hover:text-text"
      >
        {show ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
}

function Banners({ error, notice }: { error: string | null; notice: string | null }) {
  if (!error && !notice) return null;
  return (
    <div className="flex flex-col gap-2">
      {notice && (
        <p role="status" className="rounded-md bg-success/10 px-3 py-2 text-sm font-medium text-success">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={busy} className="w-full">
      {busy && <SpinnerGapIcon size={18} className="animate-spin" />}
      {children}
    </Button>
  );
}

function FooterSwitch({
  prompt,
  action,
  onClick,
}: {
  prompt: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="border-t border-border pt-4 text-center text-sm text-text-secondary">
      {prompt}{' '}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-accent-hover hover:underline"
      >
        {action}
      </button>
    </p>
  );
}

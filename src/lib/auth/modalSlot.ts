/**
 * Function slot connecting the auth provider to the auth modal — the same
 * pattern the api client uses for its token getter. AuthProvider mounts above
 * the router and stays router-free, while the modal (it renders <Link>s) lives
 * inside the router; the slot lets `signIn()` open it without either side
 * importing the other.
 */
export type AuthModalView = 'signin' | 'signup';

let opener: ((view: AuthModalView) => void) | null = null;

/** Registered by AuthModalProvider while mounted; pass null to detach. */
export function setAuthModalOpener(fn: ((view: AuthModalView) => void) | null) {
  opener = fn;
}

export function requestAuthModal(view: AuthModalView = 'signin') {
  opener?.(view);
}

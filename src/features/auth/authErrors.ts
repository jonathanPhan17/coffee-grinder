/**
 * Cognito error → copy a person can act on. The pool has user-enumeration
 * protection on, so "wrong password" and "no such account" arrive as the same
 * NotAuthorizedException — the wording stays honest about that.
 */
export function friendlyAuthError(
  err: unknown,
  fallback = 'Something went wrong. Give it another try.',
): string {
  const { name, code, message } = (err ?? {}) as {
    name?: string;
    code?: string;
    message?: string;
  };

  switch (code ?? name) {
    case 'NotAuthorizedException':
      return message?.toLowerCase().includes('disabled')
        ? 'This account has been disabled.'
        : 'Incorrect email or password.';
    case 'UserNotFoundException':
      return 'Incorrect email or password.';
    case 'UsernameExistsException':
      return 'An account with this email already exists. Try signing in instead.';
    case 'InvalidPasswordException':
      // Cognito's own text carries the pool policy detail, minus its prefix.
      return message?.replace(/^Password did not conform with policy:\s*/i, '') ||
        'That password does not meet the requirements.';
    case 'InvalidParameterException':
      return 'Check the email and password and try again.';
    case 'CodeMismatchException':
      return 'That code is not right. Check the email and try again.';
    case 'ExpiredCodeException':
      return 'That code has expired. Request a new one.';
    case 'LimitExceededException':
    case 'TooManyRequestsException':
    case 'TooManyFailedAttemptsException':
      return 'Too many attempts. Wait a few minutes and try again.';
    case 'PasswordResetRequiredException':
      return 'Your password needs to be reset. Use the forgot-password link.';
    case 'NetworkError':
      return 'Network trouble. Check your connection and try again.';
    case 'UnsupportedChallengeError':
      return message ?? fallback;
    default:
      return fallback;
  }
}

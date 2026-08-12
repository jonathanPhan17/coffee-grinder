import { useContext } from 'react';
import { AuthSessionContext } from './context';

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  return ctx;
}

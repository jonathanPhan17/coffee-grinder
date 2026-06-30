import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ResumeProfile } from '@/types/domain';
import { ResumeContext } from './context';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const clearProfile = useCallback(() => setProfile(null), []);
  const value = useMemo(
    () => ({ profile, setProfile, clearProfile }),
    [profile, clearProfile],
  );

  return <ResumeContext value={value}>{children}</ResumeContext>;
}

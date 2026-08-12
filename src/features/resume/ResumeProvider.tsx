import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResumeProfile } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthSession } from '@/lib/auth/useAuthSession';
import type { ResumeProfile } from '@/types/domain';
import { ResumeContext } from './context';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const { isEnabled, isLoading: authIsLoading, isAuthenticated } = useAuthSession();
  const [localProfile, setProfile] = useState<ResumeProfile | null>(null);
  // "Re-upload" must show the dropzone even though the server still has a profile
  // (there is no DELETE /resume) — cleared suppresses the hydrated copy until the
  // next successful upload sets a local one.
  const [cleared, setCleared] = useState(false);

  // The server is the source of truth: without this, a refresh forgets the profile
  // and re-locks every gated page. staleTime Infinity because the profile only
  // changes through uploads in this tab, which write the cache directly.
  // Don't fetch before sign-in has finished — the request would only 401.
  const queryEnabled = !isEnabled || isAuthenticated;
  const { data: serverProfile, isLoading } = useQuery({
    queryKey: queryKeys.resume.profile,
    queryFn: getResumeProfile,
    staleTime: Infinity,
    enabled: queryEnabled,
  });

  // Trap: TanStack v5 reports isLoading false on a DISABLED query, so while
  // auth is still resolving the query's isLoading alone would claim hydration
  // is done and gates would bounce — fold the auth wait in explicitly.
  const isHydrating = authIsLoading || (queryEnabled && isLoading);

  // A pending (parsed:false) server profile counts as absent: it is an upload that
  // never finished parsing, and the dropzone is the honest place to land.
  const hydrated = !cleared && serverProfile?.parsed ? serverProfile : null;
  const profile = localProfile ?? hydrated;

  const clearProfile = useCallback(() => {
    setProfile(null);
    setCleared(true);
  }, []);

  const value = useMemo(
    () => ({ profile, setProfile, clearProfile, isHydrating }),
    [profile, clearProfile, isHydrating],
  );

  return <ResumeContext value={value}>{children}</ResumeContext>;
}

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResumeProfile } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ResumeProfile } from '@/types/domain';
import { ResumeContext } from './context';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [localProfile, setProfile] = useState<ResumeProfile | null>(null);
  // "Re-upload" must show the dropzone even though the server still has a profile
  // (there is no DELETE /resume) — cleared suppresses the hydrated copy until the
  // next successful upload sets a local one.
  const [cleared, setCleared] = useState(false);

  // The server is the source of truth: without this, a refresh forgets the profile
  // and re-locks every gated page. staleTime Infinity because the profile only
  // changes through uploads in this tab, which write the cache directly.
  const { data: serverProfile, isLoading: isHydrating } = useQuery({
    queryKey: queryKeys.resume.profile,
    queryFn: getResumeProfile,
    staleTime: Infinity,
  });

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

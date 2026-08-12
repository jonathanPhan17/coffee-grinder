import { useQuery } from '@tanstack/react-query';
import { getQuota } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthSession } from '@/lib/auth/useAuthSession';

/**
 * Remaining free-run allowance for the signed-in user. Purely a convenience
 * read: consumers render nothing while it loads or fails and never block the
 * CTA on it - the server's 429 on POST /runs is the real enforcement.
 */
export function useQuota() {
  const { isEnabled, isLoading: authIsLoading, isAuthenticated } = useAuthSession();
  // Don't fetch before sign-in has finished - the request would only 401.
  const queryEnabled = !isEnabled || isAuthenticated;
  const { data, isError, isLoading } = useQuery({
    queryKey: queryKeys.quota.current,
    queryFn: getQuota,
    enabled: queryEnabled,
    // Override the global 30s staleTime: with refetchOnWindowFocus off, a
    // cached count would otherwise sit stale across run-setup visits. Refetch
    // on every mount instead; the server's 429 remains the backstop.
    staleTime: 0,
    // Only while exhausted: a tab parked on run-setup across the UTC month
    // rollover must re-enable on its own -- the poll picks up the fresh window
    // (render can't check the clock itself; react-hooks/purity forbids it).
    refetchInterval: (query) =>
      query.state.data?.monthly.remaining === 0 ? 60_000 : false,
  });
  return {
    data,
    isError,
    // Trap: TanStack v5 reports isLoading false on a DISABLED query, so while
    // auth is still resolving the flag alone would claim the fetch finished -
    // fold the auth wait in explicitly (same trick as ResumeProvider).
    isLoading: authIsLoading || (queryEnabled && isLoading),
  };
}

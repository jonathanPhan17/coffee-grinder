import { useQuery } from '@tanstack/react-query';
import { getRun } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';

export function useRunStatus(runId: string) {
  return useQuery({
    queryKey: queryKeys.runs.detail(runId),
    queryFn: () => getRun(runId),
    // Callers pass '' when the page has no run in scope (Results without ?run);
    // without this guard that fires GET /runs/ and re-polls the 404 forever.
    enabled: Boolean(runId),
    // Poll while the run is in flight; stop once it settles.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'done' || status === 'error' ? false : 2000;
    },
  });
}

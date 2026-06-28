import { useQuery } from '@tanstack/react-query';
import { getRun } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';

export function useRunStatus(runId: string) {
  return useQuery({
    queryKey: queryKeys.runs.detail(runId),
    queryFn: () => getRun(runId),
    // Poll while the run is in flight; stop once it settles.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'done' || status === 'error' ? false : 2000;
    },
  });
}

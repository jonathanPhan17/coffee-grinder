import { useQuery } from '@tanstack/react-query';
import { listMatches } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';

export function useMatches(runId: string) {
  return useQuery({
    queryKey: queryKeys.matches.list(runId),
    queryFn: () => listMatches(runId),
    enabled: Boolean(runId),
  });
}

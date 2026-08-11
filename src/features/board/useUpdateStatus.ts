import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMatchStatus } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import type { Match, PipelineStatus } from '@/types/domain';

/**
 * Optimistically writes the new status into every cached view of the match
 * (board, per-run lists, detail) so other screens agree with the drop
 * immediately, and restores the snapshots if the PATCH fails.
 */
export function useUpdateStatus() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PipelineStatus }) =>
      updateMatchStatus(id, status),
    onMutate: async ({ id, status }) => {
      await client.cancelQueries({ queryKey: queryKeys.matches.all });
      const snapshots = client.getQueriesData({ queryKey: queryKeys.matches.all });
      client.setQueriesData({ queryKey: queryKeys.matches.all }, (data: unknown) => {
        if (Array.isArray(data)) {
          return data.map((m: Match) => (m.id === id ? { ...m, status } : m));
        }
        const match = data as Match | undefined;
        return match?.id === id ? { ...match, status } : data;
      });
      return { snapshots };
    },
    onError: (_error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => client.setQueryData(key, data));
    },
  });
}

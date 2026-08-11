import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { getMatch } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import type { Match } from '@/types/domain';

/**
 * The list and board responses already carry the full match, evidence
 * included, so the match the user just clicked is almost always in cache.
 * Serve it as placeholder data and the scorecard renders instantly while
 * the detail fetch revalidates in the background.
 */
function cachedMatch(client: QueryClient, matchId: string): Match | undefined {
  for (const [, data] of client.getQueriesData<Match[]>({ queryKey: queryKeys.matches.all })) {
    // The prefix also matches detail entries, whose data is a single Match.
    if (!Array.isArray(data)) continue;
    const match = data.find((m) => m.id === matchId);
    if (match) return match;
  }
  return undefined;
}

export function useMatch(matchId: string) {
  const client = useQueryClient();
  return useQuery({
    queryKey: queryKeys.matches.detail(matchId),
    queryFn: () => getMatch(matchId),
    enabled: Boolean(matchId),
    placeholderData: () => cachedMatch(client, matchId),
  });
}

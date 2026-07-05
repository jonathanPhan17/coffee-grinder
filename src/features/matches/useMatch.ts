import { useQuery } from '@tanstack/react-query';
import { getMatch } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: queryKeys.matches.detail(matchId),
    queryFn: () => getMatch(matchId),
    enabled: Boolean(matchId),
  });
}

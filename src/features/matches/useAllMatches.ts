import { useQuery } from '@tanstack/react-query';
import { listAllMatches } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';

export function useAllMatches() {
  return useQuery({
    queryKey: queryKeys.matches.board,
    queryFn: listAllMatches,
  });
}

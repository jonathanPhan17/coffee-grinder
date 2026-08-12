/**
 * Central cache-key factory. Every useQuery/useMutation references keys from
 * here so cache identity stays consistent and typo-proof across feature hooks.
 *
 *   useQuery({ queryKey: queryKeys.matches.list(runId), ... })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.matches.all })
 */
export const queryKeys = {
  resume: {
    profile: ['resume'] as const,
  },
  runs: {
    all: ['runs'] as const,
    detail: (runId: string) => ['runs', runId] as const,
  },
  quota: {
    current: ['quota'] as const,
  },
  matches: {
    all: ['matches'] as const,
    board: ['matches', 'board'] as const,
    list: (runId: string) => ['matches', 'list', runId] as const,
    detail: (matchId: string) => ['matches', 'detail', matchId] as const,
  },
  coverLetters: {
    list: (matchId: string) => ['coverletters', matchId] as const,
  },
} as const;

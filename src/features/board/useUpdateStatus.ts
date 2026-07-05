import { useMutation } from '@tanstack/react-query';
import { updateMatchStatus } from '@/lib/api/endpoints';
import type { PipelineStatus } from '@/types/domain';

export function useUpdateStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PipelineStatus }) =>
      updateMatchStatus(id, status),
  });
}

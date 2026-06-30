import { useMutation } from '@tanstack/react-query';
import { startRun } from '@/lib/api/endpoints';

export function useStartRun() {
  return useMutation({ mutationFn: startRun });
}

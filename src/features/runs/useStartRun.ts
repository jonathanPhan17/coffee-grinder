import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { startRun } from '@/lib/api/endpoints';
import { queryClient } from '@/lib/api/queryClient';
import { queryKeys } from '@/lib/api/queryKeys';
import { formatMonthDay } from '@/lib/utils/formatDate';
import type { QuotaExceededBody } from '@/types/domain';

export function useStartRun() {
  return useMutation({
    mutationFn: startRun,
    // Hook-level on purpose: RunSetupPage navigates away on success, so a
    // callback passed to mutate() would die with the unmount. These always run.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quota.current });
    },
    onError: (error) => {
      // A 429 means the server's counts moved under our cached copy (another
      // tab, or the site-wide daily cap) - refetch so the indicator is honest.
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        queryClient.invalidateQueries({ queryKey: queryKeys.quota.current });
      }
    },
  });
}

/** Maps a failed POST /runs to the message the run-setup banner shows. */
export function startRunErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    const body = error.response.data as Partial<QuotaExceededBody> | null;
    if (body?.code === 'monthly_quota') {
      const base = `You've used all ${body.limit ?? 5} free runs this month.`;
      const reset = body.resetsAt ? formatMonthDay(body.resetsAt) : '';
      return reset ? `${base} Resets ${reset}.` : base;
    }
    if (body?.code === 'daily_cap') {
      return 'Coffee Grinder hit its site-wide daily run cap. Try again tomorrow.';
    }
  }
  return "Couldn't start the run. Try again.";
}

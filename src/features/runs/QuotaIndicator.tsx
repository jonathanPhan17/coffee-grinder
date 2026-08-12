import { TicketIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { quotaTone } from '@/lib/presentation';
import { formatMonthDay } from '@/lib/utils/formatDate';
import type { QuotaWindow } from '@/types/domain';

/**
 * "Free runs" row for the run-setup card - mirrors the resume-ready row above
 * it. Purely presentational; the caller decides whether to render it (nothing
 * shows while the quota query loads or fails - the server enforces the limit,
 * so a failed convenience read must never block the user).
 */
export function QuotaIndicator({ monthly }: { monthly: QuotaWindow }) {
  const resetLabel = monthly.remaining === 0 ? formatMonthDay(monthly.resetsAt) : '';
  return (
    <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
      <TicketIcon size={20} weight="fill" className="shrink-0 text-accent" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold">Free runs</span>
        {resetLabel && (
          <span className="text-xs text-danger">Resets {resetLabel}</span>
        )}
      </div>
      <Badge tone={quotaTone(monthly.remaining)}>
        {monthly.remaining} of {monthly.limit} left this month
      </Badge>
    </div>
  );
}

import { WarningIcon } from '@phosphor-icons/react';
import { startRunErrorMessage } from '@/features/runs/useStartRun';

/**
 * Inline failure notice for a POST /runs error - rendered adjacent to the CTA
 * (not at the page top: on the stacked mobile layout the top is off-screen when
 * the user taps Start, which would make the failure invisible). role="alert"
 * announces it to screen readers on mount.
 */
export function RunErrorNotice({ error }: { error: unknown }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-warning px-3 py-2.5"
    >
      <WarningIcon size={20} weight="fill" className="shrink-0 text-warning" />
      <span className="text-sm text-text-secondary">{startRunErrorMessage(error)}</span>
    </div>
  );
}

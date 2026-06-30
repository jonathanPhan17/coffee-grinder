import { useState } from 'react';
import { CaretDownIcon, QuotesIcon, SparkleIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { confidenceLabel, criterionBadge } from '@/lib/presentation';
import type { CriterionEvidence, Verdict } from '@/types/domain';

const borderByVerdict: Record<Verdict, string> = {
  met: 'border-l-success',
  partial: 'border-l-warning',
  not_met: 'border-l-danger',
};

interface CriterionRowProps {
  evidence: CriterionEvidence;
}

export function CriterionRow({ evidence }: CriterionRowProps) {
  const badge = criterionBadge(evidence.group, evidence.verdict);
  // Auto-expand gaps so what is missing is visible immediately.
  const [open, setOpen] = useState(evidence.verdict !== 'met');

  return (
    <div
      className={cn(
        'rounded-md border border-l-4 border-border bg-bg',
        borderByVerdict[evidence.verdict],
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Badge tone={badge.tone}>{badge.label}</Badge>
        <span className="flex-1 font-medium">{evidence.criterion}</span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-1 w-10 overflow-hidden rounded-full bg-elevated">
            <span
              className="block h-full rounded-full bg-text-secondary"
              style={{ width: `${Math.round(evidence.confidence * 100)}%` }}
            />
          </span>
          <span className="text-xs text-text-secondary">
            {confidenceLabel(evidence.confidence)}
          </span>
        </span>
        <CaretDownIcon
          size={16}
          className={cn(
            'shrink-0 text-text-secondary transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3">
          {evidence.snippet && (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary">
                <QuotesIcon size={12} weight="fill" />
                From your résumé
              </span>
              <p className="text-sm">{evidence.snippet}</p>
            </div>
          )}
          <div className="flex items-start gap-1.5">
            <SparkleIcon size={14} weight="fill" className="mt-0.5 shrink-0 text-accent" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text">AI reasoning · </span>
              {evidence.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

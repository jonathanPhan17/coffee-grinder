import { CheckCircleIcon, WarningIcon } from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { criterionBadge } from '@/lib/presentation';
import type { CriterionEvidence } from '@/types/domain';

interface GapCalloutProps {
  evidence: CriterionEvidence[];
}

export function GapCallout({ evidence }: GapCalloutProps) {
  const gaps = evidence.filter((e) => e.verdict !== 'met');

  if (gaps.length === 0) {
    return (
      <Card className="flex items-center gap-3 border-success">
        <CheckCircleIcon size={22} weight="fill" className="shrink-0 text-success" />
        <div className="flex flex-col">
          <span className="font-semibold">No gaps — you clear every criterion.</span>
          <span className="text-sm text-text-secondary">
            This is a clean match. Worth applying with confidence.
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3 border-warning">
      <div className="flex items-center gap-2">
        <WarningIcon size={20} weight="fill" className="shrink-0 text-warning" />
        <span className="font-semibold">
          {gaps.length} gap{gaps.length === 1 ? '' : 's'} worth a look before you apply
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {gaps.map((g) => {
          const badge = criterionBadge(g.group, g.verdict);
          return (
            <span
              key={g.id}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm"
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  g.verdict === 'partial' ? 'bg-warning' : 'bg-danger',
                )}
              />
              {g.criterion} · {badge.label}
            </span>
          );
        })}
      </div>
    </Card>
  );
}

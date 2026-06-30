import type { ReactNode } from 'react';
import { CriterionRow } from './CriterionRow';
import type { CriterionEvidence } from '@/types/domain';

interface CriteriaGroupProps {
  title: string;
  icon?: ReactNode;
  items: CriterionEvidence[];
}

export function CriteriaGroup({ title, icon, items }: CriteriaGroupProps) {
  if (items.length === 0) return null;

  const met = items.filter((i) => i.verdict === 'met').length;
  const partial = items.filter((i) => i.verdict === 'partial').length;
  const summary =
    partial > 0
      ? `${met} of ${items.length} met · ${partial} partial`
      : `${met} of ${items.length} met`;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          {icon}
          {title}
        </h2>
        <span className="text-sm text-text-secondary">{summary}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((e) => (
          <CriterionRow key={e.id} evidence={e} />
        ))}
      </div>
    </section>
  );
}

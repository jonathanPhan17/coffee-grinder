import type { ReactNode } from 'react';
import { CriterionRow } from './CriterionRow';
import { isUnconfirmedDealbreaker } from '@/lib/presentation';
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
  // Unconfirmable dealbreakers ("couldn't tell from the résumé") are not failures,
  // so they leave the met/not-met tally and get their own count.
  const unconfirmed = items.filter(isUnconfirmedDealbreaker).length;
  const tallied = items.length - unconfirmed;
  const parts = [
    tallied > 0 ? `${met} of ${tallied} met` : '',
    partial > 0 ? `${partial} partial` : '',
    unconfirmed > 0 ? `${unconfirmed} can't be confirmed` : '',
  ].filter(Boolean);
  const summary = parts.join(' · ');

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

import { CoffeeIcon } from '@phosphor-icons/react';
import type { Run } from '@/types/domain';

interface BrewingProgressProps {
  run?: Run;
}

export function BrewingProgress({ run }: BrewingProgressProps) {
  const count = run?.count ?? 0;
  const screened = run?.screened ?? 0;
  const pct = count ? Math.round((screened / count) * 100) : 0;
  const status = run?.status ?? 'queued';

  const heading =
    status === 'done'
      ? 'All matches brewed!'
      : status === 'screening'
        ? `Screening job ${Math.min(count, screened + 1)} of ${count}…`
        : 'Fetching postings…';

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="grid size-24 place-items-center rounded-full border-2 border-border text-accent">
        <CoffeeIcon size={40} weight="fill" className="animate-pulse" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">{heading}</h2>
        <p className="max-w-md text-text-secondary">
          Sit tight — this usually takes under two minutes. We are reading every
          posting so you do not have to.
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-text-secondary">Grinding fit scores</span>
          <span className="font-semibold text-accent">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

import { BuildingsIcon, CaretDownIcon, MapPinIcon, QuotesIcon, SparkleIcon, WarningIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/utils/cn';
import { confidenceLabel, criterionBadge } from '@/lib/presentation';
import { useCountUp } from './useCountUp';
import type { CriterionEvidence } from '@/types/domain';
import type { Tone } from '@/types/ui';

// The Lumen Labs demo match (mockMatches[0], trimmed) — real fixture content
// rendered through the real scorecard pieces, so the hero can never drift from
// what the product actually looks like.
const DEMO_ROWS: CriterionEvidence[] = [
  {
    id: 'hero-c1',
    group: 'must_have',
    criterion: 'Proficient in React (hooks, modern component patterns)',
    verdict: 'met',
    confidence: 0.9,
    snippet: 'React 18 across a 6-month internship and 2 personal projects',
    reasoning: 'Multiple substantial React builds show genuine hands-on proficiency.',
  },
  {
    id: 'hero-c2',
    group: 'must_have',
    criterion: 'Strong JavaScript & TypeScript fundamentals',
    verdict: 'met',
    confidence: 0.9,
    snippet: 'TypeScript used as the default language across all listed projects',
    reasoning: 'Consistent TS usage signals solid typed-JavaScript fundamentals.',
  },
  {
    id: 'hero-c3',
    group: 'must_have',
    criterion: '1+ year of professional engineering experience',
    verdict: 'partial',
    confidence: 0.6,
    snippet: 'One 6-month internship plus two independent projects',
    reasoning: 'Internship and projects approach the bar but fall short of a full professional year.',
  },
];

const DEMO_GAPS = [
  { label: '1+ year of professional engineering experience · Partial', tone: 'warning' },
  { label: 'GraphQL / Apollo Client experience · Not met', tone: 'danger' },
  { label: 'Experience with Next.js · Partial', tone: 'warning' },
] as const;

// Mirrors CriterionRow's stripe map — the mock must never disagree with the badge.
const borderByTone: Record<Tone, string> = {
  accent: 'border-l-accent',
  success: 'border-l-success',
  warning: 'border-l-warning',
  danger: 'border-l-danger',
  neutral: 'border-l-border',
};

/** A CriterionRow lookalike without interactivity — the mock is decorative. */
function DemoRow({ evidence, open = false }: { evidence: CriterionEvidence; open?: boolean }) {
  const badge = criterionBadge(evidence);
  return (
    <div className={cn('rounded-md border border-l-4 border-border bg-bg', borderByTone[badge.tone])}>
      <div className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <Badge tone={badge.tone}>{badge.label}</Badge>
        <span className="flex-1 font-medium">{evidence.criterion}</span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-1 w-10 overflow-hidden rounded-full bg-elevated">
            <span
              className="block h-full rounded-full bg-text-secondary"
              style={{ width: `${Math.round(evidence.confidence * 100)}%` }}
            />
          </span>
          <span className="text-xs text-text-secondary">{confidenceLabel(evidence.confidence)}</span>
        </span>
        <CaretDownIcon
          size={16}
          className={cn('shrink-0 text-text-secondary', open && 'rotate-180')}
        />
      </div>
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

/**
 * The hero: a live render of the scorecard built from the app's real pieces
 * (ScoreRing, Badge, presentation mappers) with fixture content. Decorative —
 * hidden from the tree and inert so none of it reads as page controls.
 */
export function HeroScorecard() {
  const score = useCountUp(94, 1200, 500);

  return (
    <div className="relative">
      {/* Warm glow so the card sits in light, not on a flat wall. Stays inside
          the page's px-6 gutter (24px) — a wider box would x-scroll on mobile;
          the blur itself is ink overflow and never scrolls. */}
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[3rem] bg-accent/10 blur-3xl"
      />
      <div aria-hidden inert className="pointer-events-none select-none motion-safe:animate-hero-float">
        <Card elevated className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated font-display text-xl font-semibold">
                L
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-2xl font-semibold">Junior Frontend Engineer</span>
                  <Badge tone="success">Strong fit</Badge>
                </div>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <BuildingsIcon size={14} />
                    Lumen Labs
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon size={14} />
                    Remote · US
                  </span>
                  <span>$95k–$120k</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ScoreRing score={score} size={96} strokeWidth={7} label="MATCH" />
              <span className="text-xs text-text-secondary">5 of 6 must-haves met</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md border border-warning px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <WarningIcon size={16} weight="fill" className="shrink-0 text-warning" />3 gaps worth
              a look before you apply
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_GAPS.map((gap) => (
                <span
                  key={gap.label}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs"
                >
                  <span className={cn('size-1.5 rounded-full', gap.tone === 'warning' ? 'bg-warning' : 'bg-danger')} />
                  {gap.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_ROWS.map((row, i) => (
              <div
                key={row.id}
                style={{ animationDelay: `${600 + i * 250}ms` }}
                className="motion-safe:animate-landing-rise"
              >
                <DemoRow evidence={row} open={i === 0} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

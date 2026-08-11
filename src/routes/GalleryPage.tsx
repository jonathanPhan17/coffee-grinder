/**
 * Dev-only component gallery — renders the app's components in every state from
 * hand-written fixtures, with no backend calls. The route is registered only
 * when `import.meta.env.DEV` (see App.tsx), so none of this ships to production.
 *
 * Open http://localhost:5173/dev/gallery. Add a scenario by adding a fixture —
 * Vite hot-reloads the page as you edit.
 */
import type { ReactNode } from 'react';
import { ListChecksIcon, ShieldCheckIcon, WarningIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCard } from '@/features/results/MatchCard';
import { BrewingProgress } from '@/features/runs/BrewingProgress';
import { RunSteps } from '@/features/runs/RunSteps';
import { CriteriaGroup } from '@/features/scorecard/CriteriaGroup';
import { CriterionRow } from '@/features/scorecard/CriterionRow';
import { GapCallout } from '@/features/scorecard/GapCallout';
import { ScoreHeader } from '@/features/scorecard/ScoreHeader';
import type { CriterionEvidence, Match, Run } from '@/types/domain';
import type { Tone } from '@/types/ui';

/* ── Fixture builders ────────────────────────────────────────────────── */

let nextId = 0;

function ev(
  group: CriterionEvidence['group'],
  verdict: CriterionEvidence['verdict'],
  confidence: number,
  criterion: string,
  over: Partial<CriterionEvidence> = {},
): CriterionEvidence {
  nextId += 1;
  return {
    id: `gallery-${nextId}`,
    group,
    verdict,
    confidence,
    criterion,
    reasoning: 'Gallery fixture — a one-line explanation of how the verdict was reached.',
    ...over,
  };
}

function mkMatch(
  over: Partial<Omit<Match, 'posting'>> = {},
  posting: Partial<Match['posting']> = {},
): Match {
  return {
    id: 'gallery-match',
    runId: 'gallery-run',
    score: 82,
    fitTier: 'strong',
    summary: 'Strong fit: the core stack lines up almost perfectly.',
    status: 'matched',
    evidence: [],
    ...over,
    posting: {
      sourceId: 'gallery-posting',
      source: 'pasted',
      title: 'Frontend Engineer',
      company: 'Acme',
      location: 'Remote',
      description: 'Gallery fixture posting.',
      applyUrl: 'https://example.com',
      salary: { min: 120000, max: 155000 },
      ...posting,
    },
  };
}

function mkRun(over: Partial<Run> = {}): Run {
  return {
    id: 'gallery-run',
    status: 'screening',
    count: 20,
    query: 'Frontend Engineer, React',
    location: 'United States',
    remote: true,
    createdAt: '2026-08-11T09:00:00.000Z',
    ...over,
  };
}

/* ── Scenarios ───────────────────────────────────────────────────────── */

const rowScenarios: { note: string; evidence: CriterionEvidence }[] = [
  {
    note: 'Met, high confidence, with an evidence quote',
    evidence: ev('must_have', 'met', 0.9, 'Proficient in React (hooks, modern patterns)', {
      snippet: 'React 18 across a 6-month internship and 2 personal projects',
    }),
  },
  {
    note: 'Partial, medium confidence',
    evidence: ev('must_have', 'partial', 0.6, '1+ year of professional experience', {
      snippet: 'One 6-month internship plus two independent projects',
    }),
  },
  {
    note: 'Not met — no snippet, reasoning only',
    evidence: ev('nice_to_have', 'not_met', 0.9, 'GraphQL / Apollo Client experience'),
  },
  {
    note: 'Partial at LOW confidence (0.3) — weakest possible credit',
    evidence: ev('nice_to_have', 'partial', 0.3, 'Experience with Next.js', {
      snippet: 'React experience is transferable but no explicit Next.js mention',
    }),
  },
  {
    note: 'Dealbreaker satisfied — reads "Cleared"',
    evidence: ev('dealbreaker', 'met', 0.9, 'Authorized to work in the United States', {
      snippet: 'US-based, no sponsorship noted',
    }),
  },
  {
    note: 'Dealbreaker UNVERIFIABLE (not_met below the 0.7 gate) — amber "Can\'t confirm", score not capped',
    evidence: ev('dealbreaker', 'not_met', 0.3, 'Authorized to work in the United States', {
      reasoning:
        'The résumé suggests US presence but work authorization is not explicitly stated and cannot be confirmed from the résumé alone.',
    }),
  },
  {
    note: 'Dealbreaker CONFIDENTLY violated (≥ 0.7) — red "Not met", score capped at 25',
    evidence: ev('dealbreaker', 'not_met', 0.9, 'Must hold an active TS/SCI security clearance', {
      reasoning: 'No clearance is listed and the résumé history makes an active clearance implausible.',
    }),
  },
  {
    note: 'Absurdly long criterion text — wrapping check',
    evidence: ev(
      'must_have',
      'met',
      0.75,
      'Demonstrated experience designing, building, deploying, and operating highly available distributed systems on public cloud infrastructure, including observability, incident response, capacity planning, and cost optimization across multiple regions',
      { snippet: 'Ran a multi-region serverless stack with alarms, runbooks, and budget caps' },
    ),
  },
];

const dealbreakerMixed: CriterionEvidence[] = [
  ev('dealbreaker', 'met', 0.9, 'Willing to work hybrid from Palo Alto'),
  ev('dealbreaker', 'not_met', 0.9, 'Must hold an active TS/SCI security clearance'),
  ev('dealbreaker', 'not_met', 0.3, 'Authorized to work in the United States'),
];

const manyGaps: CriterionEvidence[] = [
  ev('must_have', 'partial', 0.6, 'Strong Python skills with Flask or Django'),
  ev('nice_to_have', 'not_met', 0.8, 'Experience building data pipelines'),
  ev('nice_to_have', 'not_met', 0.8, 'Experience building analytics platforms'),
  ev('nice_to_have', 'partial', 0.5, 'Experience building internal tools'),
  ev('nice_to_have', 'not_met', 0.8, 'Experience visualizing time-series data'),
  ev('nice_to_have', 'not_met', 0.8, 'Exposure to privacy workflows'),
  ev('nice_to_have', 'partial', 0.5, 'Exposure to security workflows'),
  ev('nice_to_have', 'not_met', 0.8, 'Exposure to compliance workflows'),
  ev('nice_to_have', 'not_met', 0.8, 'Familiarity with CCPA or GDPR'),
  ev('nice_to_have', 'partial', 0.5, 'Interest in data visualization'),
  ev('must_have', 'not_met', 0.8, 'Experience mentoring junior engineers'),
  ev('dealbreaker', 'not_met', 0.3, 'Authorized to work in the United States'),
];

const badgeTones: Tone[] = ['accent', 'success', 'warning', 'danger', 'neutral'];

/* ── Page ────────────────────────────────────────────────────────────── */

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {note && <p className="text-sm text-text-secondary">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold">Component gallery</h1>
        <p className="text-text-secondary">
          Dev-only. Every state below is a hand-written fixture — no backend, no cost. Edit
          <code className="mx-1 rounded bg-elevated px-1.5 py-0.5 text-sm">GalleryPage.tsx</code>
          and it hot-reloads.
        </p>
      </div>

      <Section
        title="Criterion rows — every state"
        note='Including today&apos;s fix: an unverifiable dealbreaker is amber "Can&apos;t confirm", a confident violation stays red.'
      >
        <div className="flex flex-col gap-4">
          {rowScenarios.map(({ note, evidence }) => (
            <div key={evidence.id} className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {note}
              </p>
              <CriterionRow evidence={evidence} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Group tallies"
        note="How the section headers count met / partial / can&apos;t-be-confirmed."
      >
        <div className="flex flex-col gap-6">
          <CriteriaGroup
            title="Dealbreakers — one unverifiable"
            icon={<ShieldCheckIcon size={18} className="text-accent" />}
            items={[ev('dealbreaker', 'not_met', 0.3, 'Authorized to work in the United States')]}
          />
          <CriteriaGroup
            title="Dealbreakers — cleared + violated + unverifiable"
            icon={<ShieldCheckIcon size={18} className="text-accent" />}
            items={dealbreakerMixed}
          />
          <CriteriaGroup
            title="Must-haves — classic mix"
            icon={<ListChecksIcon size={18} className="text-accent" />}
            items={[
              ev('must_have', 'met', 0.9, 'Ships production TypeScript'),
              ev('must_have', 'met', 0.8, 'Modern React'),
              ev('must_have', 'partial', 0.6, '5+ years of experience'),
              ev('must_have', 'not_met', 0.8, 'Kubernetes in production'),
            ]}
          />
        </div>
      </Section>

      <Section title="Gap callout" note="Zero gaps, one gap, and a wall of chips (wrapping check).">
        <div className="flex flex-col gap-4">
          <GapCallout evidence={[ev('must_have', 'met', 0.9, 'Everything')]} />
          <GapCallout evidence={[ev('must_have', 'partial', 0.6, 'Strong Python skills')]} />
          <GapCallout evidence={manyGaps} />
        </div>
      </Section>

      <Section
        title="Score header"
        note="Ring color follows the score; long titles and missing salary/location must not break layout."
      >
        <div className="flex flex-col gap-4">
          <ScoreHeader
            match={mkMatch(
              {
                score: 95,
                fitTier: 'strong',
                evidence: [
                  ev('must_have', 'met', 0.9, 'React'),
                  ev('must_have', 'met', 0.9, 'TypeScript'),
                  ev('must_have', 'met', 0.9, 'AWS'),
                ],
              },
              { title: 'Senior Frontend Engineer', company: 'Lumen Analytics' },
            )}
          />
          <ScoreHeader
            match={mkMatch(
              {
                score: 60,
                fitTier: 'fair',
                evidence: [
                  ev('must_have', 'met', 0.9, 'React'),
                  ev('must_have', 'partial', 0.6, 'Kubernetes'),
                  ev('must_have', 'not_met', 0.8, 'Go'),
                ],
              },
              { title: 'Platform Engineer', company: 'Northwind', location: undefined, salary: undefined },
            )}
          />
          <ScoreHeader
            match={mkMatch(
              {
                score: 20,
                fitTier: 'weak',
                evidence: [
                  ev('must_have', 'not_met', 0.8, 'C++'),
                  ev('must_have', 'not_met', 0.8, 'RTOS'),
                  ev('must_have', 'not_met', 0.8, 'Hardware bring-up'),
                ],
              },
              {
                title: 'Principal Distinguished Staff Software Architect, Regulated Industries & Sovereign Cloud',
                company: 'Amalgamated Consolidated Enterprises International',
                salary: { min: 240000 },
              },
            )}
          />
        </div>
      </Section>

      <Section title="Results cards">
        <div className="flex flex-col gap-4">
          <MatchCard
            match={mkMatch({ score: 88, fitTier: 'strong', summary: 'Strong fit: React, TypeScript, and AWS all line up.' })}
          />
          <MatchCard
            match={mkMatch(
              { score: 31, fitTier: 'weak', summary: 'Weak fit: the role is embedded C++ and the résumé is web-stack.' },
              { title: 'Embedded Firmware Engineer', company: 'Gearbox Robotics', location: 'Fremont, CA' },
            )}
          />
        </div>
      </Section>

      <Section
        title="Brewing screen"
        note="The run-in-flight states you normally cannot revisit without paying for a run."
      >
        <div className="flex flex-col gap-6">
          <BrewingProgress run={mkRun({ status: 'fetching', count: 8 })} />
          <BrewingProgress run={mkRun({ status: 'screening', count: 8, screened: 3 })} />
          <BrewingProgress run={mkRun({ status: 'done', count: 8, screened: 8 })} />
        </div>
      </Section>

      <Section
        title="Run steps"
        note="Mid-screening and finished-with-failures. The mid-run label shows the job position only — the run API doesn't say which posting is being scored."
      >
        <div className="flex flex-col gap-4">
          <RunSteps run={mkRun({ status: 'screening', count: 20, screened: 6, failed: 1 })} />
          <RunSteps run={mkRun({ status: 'done', count: 20, screened: 18, failed: 2 })} />
        </div>
      </Section>

      <Section title="Primitives">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {badgeTones.map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[95, 70, 45, 20].map((score) => (
              <ScoreRing key={score} score={score} label="FIT" />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Loading & error states">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <EmptyState
            icon={<WarningIcon size={28} weight="fill" />}
            title="Could not load this scorecard"
            description="Something went wrong fetching this match. Give it another try."
            action={<Button>Retry</Button>}
          />
        </div>
      </Section>
    </div>
  );
}

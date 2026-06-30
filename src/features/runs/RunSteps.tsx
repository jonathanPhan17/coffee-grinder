import {
  CheckCircleIcon,
  CircleIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import { mockMatches } from '@/mocks/fixtures';
import type { Run } from '@/types/domain';

type StepState = 'done' | 'active' | 'pending';

function StepRow({ state, label }: { state: StepState; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      {state === 'done' ? (
        <CheckCircleIcon size={18} weight="fill" className="text-success" />
      ) : state === 'active' ? (
        <CircleNotchIcon size={18} weight="bold" className="animate-spin text-accent" />
      ) : (
        <CircleIcon size={18} className="text-text-secondary" />
      )}
      <span className={state === 'pending' ? 'text-text-secondary' : 'text-text'}>
        {label}
      </span>
    </div>
  );
}

interface RunStepsProps {
  run?: Run;
}

export function RunSteps({ run }: RunStepsProps) {
  const status = run?.status ?? 'queued';
  const count = run?.count ?? 0;
  const screened = run?.screened ?? 0;
  const inScreening = status === 'screening';
  const done = status === 'done';
  const queued = Math.max(0, count - screened - 1);
  const company =
    mockMatches[screened % mockMatches.length]?.posting.company ?? 'a role';

  const fetchState: StepState = inScreening || done ? 'done' : 'active';
  const parseState: StepState = done || (inScreening && screened > 0)
    ? 'done'
    : inScreening
      ? 'active'
      : 'pending';
  const scoreState: StepState = done ? 'done' : inScreening ? 'active' : 'pending';

  const scoreLabel = done
    ? `Scored all ${count} roles`
    : inScreening
      ? `Scoring ${company} (job ${Math.min(count, screened + 1)})`
      : 'Scoring roles';

  return (
    <Card className="flex flex-col divide-y divide-border">
      <StepRow state={fetchState} label={`Fetched ${count} postings`} />
      <StepRow state={parseState} label={`Parsed requirements for ${count} roles`} />
      <StepRow state={scoreState} label={scoreLabel} />
      {inScreening && queued > 0 && (
        <StepRow state="pending" label={`${queued} roles queued`} />
      )}
    </Card>
  );
}

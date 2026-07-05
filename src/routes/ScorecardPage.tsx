import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeftIcon,
  ListChecksIcon,
  ShieldCheckIcon,
  StarIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { CriteriaGroup } from '@/features/scorecard/CriteriaGroup';
import { GapCallout } from '@/features/scorecard/GapCallout';
import { ScoreHeader } from '@/features/scorecard/ScoreHeader';
import { useMatch } from '@/features/matches/useMatch';

export function ScorecardPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { data: match, isPending, isError, refetch } = useMatch(matchId ?? '');

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<WarningIcon size={28} weight="fill" />}
        title="Could not load this scorecard"
        description="Something went wrong fetching this match. Give it another try."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  if (!match) {
    return (
      <EmptyState
        icon={<WarningIcon size={28} weight="fill" />}
        title="Match not found"
        description="We could not find that match."
        action={<Button onClick={() => navigate('/results')}>Back to results</Button>}
      />
    );
  }

  const mustHaves = match.evidence.filter((e) => e.group === 'must_have');
  const niceToHaves = match.evidence.filter((e) => e.group === 'nice_to_have');
  const dealbreakers = match.evidence.filter((e) => e.group === 'dealbreaker');

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text"
      >
        <ArrowLeftIcon size={16} />
        Back to matches
      </button>

      <ScoreHeader match={match} />
      <GapCallout evidence={match.evidence} />

      <CriteriaGroup
        title="Must-haves"
        icon={<ListChecksIcon size={18} className="text-accent" />}
        items={mustHaves}
      />
      <CriteriaGroup
        title="Nice-to-haves"
        icon={<StarIcon size={18} className="text-accent" />}
        items={niceToHaves}
      />
      <CriteriaGroup
        title="Dealbreakers"
        icon={<ShieldCheckIcon size={18} className="text-accent" />}
        items={dealbreakers}
      />
    </div>
  );
}

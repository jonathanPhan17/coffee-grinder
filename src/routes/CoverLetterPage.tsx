import { useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { CoverLetterWorkspace } from '@/features/coverletter/CoverLetterWorkspace';
import { useMatch } from '@/features/matches/useMatch';

export function CoverLetterPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { data: match, isPending, isError, refetch } = useMatch(matchId ?? '');

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text"
      >
        <ArrowLeftIcon size={16} />
        Back
      </button>

      {isPending ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-16 w-1/2" />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      ) : isError ? (
        <EmptyState
          icon={<WarningIcon size={28} weight="fill" />}
          title="Could not load this match"
          description="Something went wrong. Give it another try."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      ) : !match ? (
        <EmptyState
          icon={<WarningIcon size={28} weight="fill" />}
          title="Match not found"
          description="We could not find that match."
          action={<Button onClick={() => navigate('/results')}>Back to results</Button>}
        />
      ) : (
        <CoverLetterWorkspace match={match} />
      )}
    </div>
  );
}

import { WarningIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { BoardWorkspace } from '@/features/board/BoardWorkspace';
import { useMatches } from '@/features/results/useMatches';

export function BoardPage() {
  // Board is the user's whole pipeline; the real backend would scope this by
  // user/status. The mock reuses the demo run's matches.
  const { data: matches, isPending, isError, refetch } = useMatches('run_demo');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Your pipeline"
        title="Track every role through the funnel"
        description="Drag a card to move it along as you apply and interview."
      />

      {isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : isError ? (
        <EmptyState
          icon={<WarningIcon size={28} weight="fill" />}
          title="Could not load your pipeline"
          description="Something went wrong. Give it another try."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      ) : !matches || matches.length === 0 ? (
        <EmptyState
          title="Nothing in your pipeline yet"
          description="Run a grind and your matches will show up here to track."
        />
      ) : (
        <BoardWorkspace matches={matches} />
      )}
    </div>
  );
}

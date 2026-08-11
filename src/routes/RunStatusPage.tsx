import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { ArrowClockwiseIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BrewingProgress } from '@/features/runs/BrewingProgress';
import { RunSteps } from '@/features/runs/RunSteps';
import { useRunStatus } from '@/features/runs/useRunStatus';
import { useResume } from '@/features/resume/useResume';

export default function RunStatusPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { profile, isHydrating } = useResume();
  const { data: run, isError, refetch } = useRunStatus(runId ?? '');

  useEffect(() => {
    if (profile && run?.status === 'done') {
      const timer = setTimeout(
        () => navigate(`/results?run=${runId}`, { replace: true }),
        600,
      );
      return () => clearTimeout(timer);
    }
  }, [profile, run?.status, runId, navigate]);

  // On a refresh the stored profile is still being fetched — wait, don't bounce.
  if (isHydrating) return null;
  if (!runId || !profile) return <Navigate to="/" replace />;

  if (isError) {
    return (
      <EmptyState
        icon={<WarningIcon size={28} weight="fill" />}
        title="The grind hit a snag"
        description="We could not check the status of this run. Give it another try."
        action={
          <Button onClick={() => refetch()}>
            <ArrowClockwiseIcon size={16} weight="bold" />
            Retry
          </Button>
        }
      />
    );
  }
  if (run?.status === 'error') {
    return (
      <EmptyState
        icon={<WarningIcon size={28} weight="fill" />}
        title="This run could not finish"
        description="The run ended with an error before screening completed. Start a fresh run to try again."
        action={
          <Button onClick={() => navigate('/runs/new')}>
            <ArrowClockwiseIcon size={16} weight="bold" />
            Start a new run
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BrewingProgress run={run} />
      <RunSteps run={run} />
    </div>
  );
}

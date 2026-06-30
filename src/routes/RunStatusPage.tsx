import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { ArrowClockwiseIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BrewingProgress } from '@/features/runs/BrewingProgress';
import { RunSteps } from '@/features/runs/RunSteps';
import { useRunStatus } from '@/features/runs/useRunStatus';
import { useResume } from '@/features/resume/useResume';

export function RunStatusPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { profile } = useResume();
  const { data: run, isError, refetch } = useRunStatus(runId ?? '');

  useEffect(() => {
    if (profile && run?.status === 'done') {
      const timer = setTimeout(() => navigate('/results', { replace: true }), 600);
      return () => clearTimeout(timer);
    }
  }, [profile, run?.status, navigate]);

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

  return (
    <div className="flex flex-col gap-8">
      <BrewingProgress run={run} />
      <RunSteps run={run} />
    </div>
  );
}

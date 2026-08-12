import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ArrowLeftIcon, CheckCircleIcon, CoffeeIcon, FilePdfIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JobCountSlider } from '@/features/runs/JobCountSlider';
import { QuotaIndicator } from '@/features/runs/QuotaIndicator';
import { RunErrorNotice } from '@/features/runs/RunErrorNotice';
import { RunSetupForm, type RunSource } from '@/features/runs/RunSetupForm';
import { useStartRun } from '@/features/runs/useStartRun';
import { useQuota } from '@/features/runs/useQuota';
import { useResume } from '@/features/resume/useResume';

export default function RunSetupPage() {
  const navigate = useNavigate();
  const { profile, isHydrating } = useResume();
  const { mutate, isPending, isError, error } = useStartRun();
  // Convenience read only: while it loads or fails we show nothing and leave
  // the CTA alone - the server's 429 is the enforcement. isError matters even
  // with data present: TanStack keeps the last successful data through a failed
  // refetch, and stale numbers must not lock the button or render as current.
  const { data: quota, isError: quotaUnavailable } = useQuota();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('United States');
  const [remote, setRemote] = useState(true);
  const [source, setSource] = useState<RunSource>('auto');
  const [count, setCount] = useState(5);

  // On a refresh the stored profile is still being fetched — wait, don't bounce.
  if (isHydrating) return null;
  if (!profile) return <Navigate to="/" replace />;

  // Only fresh data disables (stale cache after a failed refetch must not lock the
  // button). Month rollover recovers via useQuota's exhausted-only poll.
  const outOfRuns = !quotaUnavailable && quota?.monthly.remaining === 0;

  const handleStart = () => {
    mutate(
      { query: query.trim(), location, remote, count },
      { onSuccess: (run) => navigate(`/runs/${run.id}`) },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Start a grind"
        title="Set up your grind"
        description="Tell us what you are after. We will fetch matching postings and score each one against your résumé."
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <RunSetupForm
          query={query}
          onQueryChange={setQuery}
          location={location}
          onLocationChange={setLocation}
          remote={remote}
          onRemoteChange={setRemote}
          source={source}
          onSourceChange={setSource}
        />

        <Card className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              How many jobs to screen?
            </span>
            <JobCountSlider value={count} onChange={setCount} />
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
            <FilePdfIcon size={20} weight="fill" className="shrink-0 text-accent" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">{profile.fileName}</span>
              <span className="truncate text-xs text-text-secondary">{profile.targetRole}</span>
            </div>
            <Badge tone="success">
              <CheckCircleIcon size={12} weight="fill" />
              Ready
            </Badge>
          </div>

          {quota && !quotaUnavailable && <QuotaIndicator monthly={quota.monthly} />}

          {isError && <RunErrorNotice error={error} />}

          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => navigate('/')}>
              <ArrowLeftIcon size={16} weight="bold" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!query.trim() || isPending || outOfRuns}
              className="flex-1"
            >
              <CoffeeIcon size={18} weight="fill" />
              {isPending ? 'Starting…' : 'Start grinding'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

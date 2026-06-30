import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CoffeeIcon,
  FilePdfIcon,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JobCountSlider } from '@/features/runs/JobCountSlider';
import { RunSetupForm, type RunSource } from '@/features/runs/RunSetupForm';
import { useStartRun } from '@/features/runs/useStartRun';
import { useResume } from '@/features/resume/useResume';

export function RunSetupPage() {
  const navigate = useNavigate();
  const { profile } = useResume();
  const { mutate, isPending } = useStartRun();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('United States');
  const [remote, setRemote] = useState(true);
  const [source, setSource] = useState<RunSource>('auto');
  const [count, setCount] = useState(20);

  if (!profile) return <Navigate to="/" replace />;

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

          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => navigate('/')}>
              <ArrowLeftIcon size={16} weight="bold" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!query.trim() || isPending}
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

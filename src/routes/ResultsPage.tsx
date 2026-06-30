import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CoffeeIcon, WarningIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterSortBar } from '@/features/results/FilterSortBar';
import { MatchCard } from '@/features/results/MatchCard';
import { MatchListSkeleton } from '@/features/results/MatchListSkeleton';
import { useMatches } from '@/features/results/useMatches';
import type { MatchFilter, MatchSort } from '@/features/results/types';

const sortLabels: Record<MatchSort, string> = {
  best: 'Best match',
  title: 'Title',
  company: 'Company',
};

export function ResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const runId = params.get('run');

  const [filter, setFilter] = useState<MatchFilter>('all');
  const [sort, setSort] = useState<MatchSort>('best');

  const { data: matches, isPending, isError, refetch } = useMatches(runId ?? '');

  const visible = useMemo(() => {
    if (!matches) return [];
    const filtered = matches.filter((m) =>
      filter === 'remote'
        ? m.posting.remote
        : filter === 'strong'
          ? m.fitTier === 'strong'
          : true,
    );
    return [...filtered].sort((a, b) =>
      sort === 'title'
        ? a.posting.title.localeCompare(b.posting.title)
        : sort === 'company'
          ? a.posting.company.localeCompare(b.posting.company)
          : b.score - a.score,
    );
  }, [matches, filter, sort]);

  if (!runId) {
    return (
      <EmptyState
        icon={<CoffeeIcon size={28} weight="fill" />}
        title="No matches brewed yet"
        description="Start a grind and we will fetch postings and score how well each one fits your résumé."
        action={<Button onClick={() => navigate('/runs/new')}>Start a grind</Button>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Your matches"
        title="The matches, best fit first"
        description={
          matches && matches.length
            ? `${visible.length} of ${matches.length} roles · sorted by ${sortLabels[sort]}`
            : undefined
        }
      />

      {isPending ? (
        <MatchListSkeleton />
      ) : isError ? (
        <EmptyState
          icon={<WarningIcon size={28} weight="fill" />}
          title="Could not load your matches"
          description="Something went wrong fetching this run. Give it another try."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      ) : !matches || matches.length === 0 ? (
        <EmptyState
          icon={<CoffeeIcon size={28} weight="fill" />}
          title="No matches in this run"
          description="This run did not return any scored roles."
          action={<Button onClick={() => navigate('/runs/new')}>Start another grind</Button>}
        />
      ) : (
        <>
          <FilterSortBar
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
          />
          {visible.length === 0 ? (
            <EmptyState
              title="No roles match this filter"
              description="Try a different filter to see more roles."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {visible.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

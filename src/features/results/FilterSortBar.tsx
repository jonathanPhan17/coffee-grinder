import type { ReactNode } from 'react';
import { FunnelIcon, SortAscendingIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import type { MatchFilter, MatchSort } from './types';

const filters: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'remote', label: 'Remote' },
  { value: 'strong', label: 'Strong fit' },
];

const sorts: { value: MatchSort; label: string }[] = [
  { value: 'best', label: 'Best match' },
  { value: 'title', label: 'Title' },
  { value: 'company', label: 'Company' },
];

interface FilterSortBarProps {
  filter: MatchFilter;
  onFilterChange: (value: MatchFilter) => void;
  sort: MatchSort;
  onSortChange: (value: MatchSort) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1 text-sm font-semibold transition-colors',
        active ? 'bg-accent text-white' : 'bg-elevated text-text-secondary hover:text-text',
      )}
    >
      {children}
    </button>
  );
}

export function FilterSortBar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: FilterSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <FunnelIcon size={16} className="text-text-secondary" />
        {filters.map((f) => (
          <Chip key={f.value} active={filter === f.value} onClick={() => onFilterChange(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <SortAscendingIcon size={16} className="text-text-secondary" />
        {sorts.map((s) => (
          <Chip key={s.value} active={sort === s.value} onClick={() => onSortChange(s.value)}>
            {s.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

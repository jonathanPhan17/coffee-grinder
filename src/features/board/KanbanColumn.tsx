import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils/cn';
import { JobCardCompact } from './JobCardCompact';
import type { Match, PipelineStatus } from '@/types/domain';

interface KanbanColumnProps {
  status: PipelineStatus;
  label: string;
  icon: ReactNode;
  matches: Match[];
}

export function KanbanColumn({ status, label, icon, matches }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3 transition-colors',
        isOver && 'border-accent bg-elevated',
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{label}</span>
        <span className="ml-auto grid size-5 place-items-center rounded-full bg-elevated text-xs text-text-secondary">
          {matches.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {matches.map((m) => (
          <JobCardCompact key={m.id} match={m} />
        ))}
        {matches.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border py-8 text-xs text-text-secondary">
            Drop a card here
          </div>
        )}
      </div>
    </div>
  );
}

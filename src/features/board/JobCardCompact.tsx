import { useDraggable } from '@dnd-kit/core';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/utils/cn';
import type { Match } from '@/types/domain';

interface JobCardCompactProps {
  match: Match;
}

export function JobCardCompact({ match }: JobCardCompactProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: match.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'flex cursor-grab touch-none items-center gap-3 rounded-md border border-border bg-bg p-3 active:cursor-grabbing',
        isDragging && 'opacity-50',
      )}
    >
      <ScoreRing score={match.score} size={40} strokeWidth={4} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{match.posting.title}</span>
        <span className="truncate text-xs text-text-secondary">{match.posting.company}</span>
      </div>
    </div>
  );
}

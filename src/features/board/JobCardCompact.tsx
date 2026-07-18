import type { ComponentPropsWithRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/utils/cn';
import type { Match } from '@/types/domain';

interface JobCardFaceProps extends ComponentPropsWithRef<'div'> {
  match: Match;
}

/**
 * The card's visual shell with no drag wiring — BoardWorkspace also renders it
 * inside the DragOverlay portal, where a draggable would be wrong.
 */
export function JobCardFace({ match, className, ...rest }: JobCardFaceProps) {
  return (
    <div
      className={cn('flex items-center gap-3 rounded-md border border-border bg-bg p-3', className)}
      {...rest}
    >
      <ScoreRing score={match.score} size={40} strokeWidth={4} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{match.posting.title}</span>
        <span className="truncate text-xs text-text-secondary">{match.posting.company}</span>
      </div>
    </div>
  );
}

interface JobCardCompactProps {
  match: Match;
}

export function JobCardCompact({ match }: JobCardCompactProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: match.id,
  });

  // No transform here: the DragOverlay is what follows the pointer (a transformed
  // card would clip against the column's scroll container). The source card stays
  // put, dimmed to read as the drop placeholder.
  return (
    <JobCardFace
      match={match}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn('cursor-grab touch-none active:cursor-grabbing', isDragging && 'opacity-40')}
    />
  );
}

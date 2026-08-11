import { useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  BookmarkSimpleIcon,
  ChatsCircleIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  TrophyIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import { JobCardFace } from './JobCardCompact';
import { KanbanColumn } from './KanbanColumn';
import { useUpdateStatus } from './useUpdateStatus';
import type { Match, PipelineStatus } from '@/types/domain';

const columns: { status: PipelineStatus; label: string; icon: ReactNode }[] = [
  { status: 'matched', label: 'Matched', icon: <SparkleIcon size={16} className="text-accent" /> },
  { status: 'shortlisted', label: 'Shortlisted', icon: <BookmarkSimpleIcon size={16} className="text-accent" /> },
  { status: 'applied', label: 'Applied', icon: <PaperPlaneTiltIcon size={16} className="text-accent" /> },
  { status: 'interviewing', label: 'Interviewing', icon: <ChatsCircleIcon size={16} className="text-accent" /> },
  { status: 'offer', label: 'Offer', icon: <TrophyIcon size={16} className="text-success" /> },
  { status: 'rejected', label: 'Rejected', icon: <XCircleIcon size={16} className="text-danger" /> },
];

interface BoardWorkspaceProps {
  matches: Match[];
}

export function BoardWorkspace({ matches }: BoardWorkspaceProps) {
  const [items, setItems] = useState<Match[]>(matches);
  // The card under the pointer, rendered in the DragOverlay portal — the source
  // card cannot follow the pointer itself without clipping inside its column's
  // scroll container.
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const { mutate } = useUpdateStatus();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveMatch(items.find((m) => m.id === String(event.active.id)) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveMatch(null);
    const { active, over } = event;
    if (!over) return;
    const matchId = String(active.id);
    const nextStatus = over.id as PipelineStatus;
    const match = items.find((m) => m.id === matchId);
    if (!match || match.status === nextStatus) return;

    setMoveError(null);
    setItems((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: nextStatus } : m)),
    );
    mutate(
      { id: matchId, status: nextStatus },
      {
        onError: () => {
          // Put just this card back where it was — other in-flight moves stay.
          setItems((prev) =>
            prev.map((m) => (m.id === matchId ? { ...m, status: match.status } : m)),
          );
          setMoveError(`Could not move "${match.posting.title}" — it is back in ${
            columns.find((c) => c.status === match.status)?.label ?? 'its column'
          }.`);
        },
      },
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveMatch(null)}
    >
      {moveError && (
        <div
          role="alert"
          className="mb-3 flex items-center gap-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          <WarningIcon size={16} weight="fill" className="shrink-0" />
          {moveError}
        </div>
      )}
      <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            icon={col.icon}
            matches={items.filter((m) => m.status === col.status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeMatch && <JobCardFace match={activeMatch} className="cursor-grabbing" />}
      </DragOverlay>
    </DndContext>
  );
}

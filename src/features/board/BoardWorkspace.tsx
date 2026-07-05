import { useState, type ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  BookmarkSimpleIcon,
  ChatsCircleIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  TrophyIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
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
  const { mutate } = useUpdateStatus();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const matchId = String(active.id);
    const nextStatus = over.id as PipelineStatus;
    const match = items.find((m) => m.id === matchId);
    if (!match || match.status === nextStatus) return;

    setItems((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: nextStatus } : m)),
    );
    mutate({ id: matchId, status: nextStatus });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
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
    </DndContext>
  );
}

import { ClockCounterClockwiseIcon, FileTextIcon } from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import type { CoverLetterDraft } from '@/types/domain';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface DraftHistoryProps {
  drafts: CoverLetterDraft[];
  onRestore: (draft: CoverLetterDraft) => void;
}

export function DraftHistory({ drafts, onRestore }: DraftHistoryProps) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        <ClockCounterClockwiseIcon size={16} className="text-text-secondary" />
        Saved drafts
      </span>

      <div className="flex flex-col gap-2">
        {drafts.map((d) => (
          <button
            key={d.version}
            type="button"
            onClick={() => onRestore(d)}
            className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-elevated"
          >
            <FileTextIcon size={18} className="shrink-0 text-accent" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold capitalize">
                {d.tone} · v{d.version}
              </span>
              <span className="text-xs text-text-secondary">{formatTime(d.createdAt)}</span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

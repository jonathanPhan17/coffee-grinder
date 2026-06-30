import { CopyIcon, FloppyDiskIcon, SparkleIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LetterEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  onSave: () => void;
  copied?: boolean;
}

export function LetterEditor({ value, onChange, onCopy, onSave, copied }: LetterEditorProps) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
        <SparkleIcon size={14} weight="fill" className="text-accent" />
        Generated from your résumé and this posting — edit freely.
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className="w-full resize-y rounded-md border border-border bg-bg p-3 text-sm leading-relaxed text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCopy}>
          <CopyIcon size={14} weight="bold" />
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" onClick={onSave}>
          <FloppyDiskIcon size={14} weight="bold" />
          Save draft
        </Button>
      </div>
    </Card>
  );
}

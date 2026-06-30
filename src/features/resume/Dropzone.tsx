import { useRef, useState, type DragEvent } from 'react';
import {
  CoffeeIcon,
  LockSimpleIcon,
  SpinnerGapIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface DropzoneProps {
  onFile: (file: File) => void;
  isParsing?: boolean;
  error?: string | null;
}

export function Dropzone({ onFile, isParsing, error }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (!isParsing) handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg border-2 border-dashed px-6 py-16 text-center transition-colors',
        dragActive ? 'border-accent bg-elevated' : 'border-border',
      )}
    >
      <div className="grid size-16 place-items-center rounded-2xl bg-elevated text-accent">
        {isParsing ? (
          <SpinnerGapIcon size={28} className="animate-spin" />
        ) : (
          <CoffeeIcon size={28} weight="fill" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-semibold">
          {isParsing ? 'Grinding your résumé…' : 'Drop your résumé to start the grind'}
        </h2>
        <p className="text-sm text-text-secondary">
          Drag a file here, or browse — PDF or DOCX, up to 10 MB
        </p>
      </div>

      <Button onClick={() => inputRef.current?.click()} disabled={isParsing}>
        <UploadSimpleIcon size={16} weight="bold" />
        Browse files
      </Button>

      {error && <p className="text-sm font-semibold text-danger">{error}</p>}

      <p className="flex items-center gap-1.5 text-xs text-text-secondary">
        <LockSimpleIcon size={14} />
        Your résumé stays private — used only to score your matches.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

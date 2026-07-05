import { cn } from '@/lib/utils/cn';
import type { CoverLetterTone } from '@/types/domain';

const tones: { value: CoverLetterTone; label: string }[] = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
];

interface ToneToggleProps {
  tone: CoverLetterTone;
  onChange: (tone: CoverLetterTone) => void;
}

export function ToneToggle({ tone, onChange }: ToneToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {tones.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            'rounded px-3 py-1 text-sm font-semibold transition-colors',
            tone === t.value ? 'bg-accent text-white' : 'text-text-secondary hover:text-text',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

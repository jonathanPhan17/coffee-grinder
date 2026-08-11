import * as Slider from '@radix-ui/react-slider';
import { ClockIcon } from '@phosphor-icons/react';

interface JobCountSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function descriptor(count: number): string {
  if (count <= 2) return 'quick grind';
  if (count <= 4) return 'balanced grind';
  return 'thorough grind';
}

function estimateMinutes(count: number): number {
  return Math.max(1, Math.round((count * 6) / 60));
}

export function JobCountSlider({ value, onChange }: JobCountSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-semibold">{value}</span>
          <span className="text-text-secondary">postings</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <ClockIcon size={15} />
          ~{estimateMinutes(value)} min · {descriptor(value)}
        </div>
      </div>

      <Slider.Root
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        min={1}
        max={5}
        step={1}
        className="relative flex h-5 w-full items-center"
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-elevated">
          <Slider.Range className="absolute h-full rounded-full bg-accent" />
        </Slider.Track>
        <Slider.Thumb
          aria-label="Number of jobs to screen"
          className="block size-5 rounded-full border-2 border-surface bg-accent shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-text-secondary">
        <span>1 · quick</span>
        <span>3</span>
        <span>5 · thorough</span>
      </div>
    </div>
  );
}

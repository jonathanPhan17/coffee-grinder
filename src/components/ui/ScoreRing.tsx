import { cn } from '@/lib/utils/cn';
import { scoreTone, toneText } from '@/lib/presentation';

interface ScoreRingProps {
  /** 0–100. */
  score: number;
  size?: number;
  strokeWidth?: number;
  /** Small caption under the number, e.g. "FIT" or "MATCH". */
  label?: string;
  className?: string;
}

export function ScoreRing({
  score,
  size = 56,
  strokeWidth = 5,
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="text-border"
          stroke="currentColor"
          fill="none"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={toneText[scoreTone(score)]}
          stroke="currentColor"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display font-semibold" style={{ fontSize: size * 0.3 }}>
          {Math.round(score)}
        </span>
        {label && (
          <span
            className="font-sans font-semibold uppercase tracking-wide text-text-secondary"
            style={{ fontSize: size * 0.12 }}
          >
            {label}
          </span>
        )}
      </span>
    </div>
  );
}

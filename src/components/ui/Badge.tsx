import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Tone } from '@/types/ui';

/**
 * Status pill — per the UI rules, badges use SOLID color fills with white
 * text + icons. Never low-opacity tinted backgrounds with dark text.
 */
const tones: Record<Tone, string> = {
  accent: 'bg-accent text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
  neutral: 'bg-elevated text-text border border-border',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children?: ReactNode;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the elevated surface token (for cards stacked on cards). */
  elevated?: boolean;
}

export function Card({ elevated, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border p-6',
        'shadow-[0_2px_12px_rgba(0,0,0,0.18)]',
        elevated ? 'bg-elevated' : 'bg-surface',
        className,
      )}
      {...props}
    />
  );
}

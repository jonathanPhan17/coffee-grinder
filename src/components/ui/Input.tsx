import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="pointer-events-none absolute left-3 text-text-secondary">
          {icon}
        </span>
      )}
      <input
        className={cn(
          'w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text',
          'placeholder:text-text-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          icon && 'pl-9',
          className,
        )}
        {...props}
      />
    </div>
  );
}

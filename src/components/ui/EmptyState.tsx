import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      {icon && (
        <div className="grid size-14 place-items-center rounded-2xl bg-elevated text-accent">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="max-w-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

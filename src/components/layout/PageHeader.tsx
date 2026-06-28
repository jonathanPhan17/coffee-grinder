import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && (
          <p className="max-w-2xl text-text-secondary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

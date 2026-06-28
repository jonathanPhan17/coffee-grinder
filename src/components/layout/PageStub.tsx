import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface PageStubProps {
  eyebrow?: string;
  title: string;
  description: string;
  planned: ReactNode;
}

// Placeholder
export function PageStub({ eyebrow, title, description, planned }: PageStubProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="max-w-2xl text-text-secondary">{description}</p>
      </div>
      <Card className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-text-secondary">
          Planned content
        </span>
        <div className="text-sm">{planned}</div>
      </Card>
    </div>
  );
}

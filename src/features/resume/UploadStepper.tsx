import { CaretRightIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

interface UploadStepperProps {
  current: number;
}

const steps = ['Upload résumé', 'Set your grind', 'Review matches'];

export function UploadStepper({ current }: UploadStepperProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold',
                active
                  ? 'border-accent bg-accent text-white'
                  : 'border-border text-text-secondary',
              )}
            >
              <span
                className={cn(
                  'grid size-5 place-items-center rounded-full text-xs',
                  active ? 'bg-white text-accent' : 'bg-elevated text-text-secondary',
                )}
              >
                {step}
              </span>
              {label}
            </div>
            {step < steps.length && (
              <CaretRightIcon size={14} className="text-text-secondary" />
            )}
          </div>
        );
      })}
    </div>
  );
}

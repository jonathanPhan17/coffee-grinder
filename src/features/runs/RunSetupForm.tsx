import type { ReactNode } from 'react';
import {
  BroadcastIcon,
  ClipboardTextIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils/cn';

export type RunSource = 'auto' | 'paste';

interface RunSetupFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  remote: boolean;
  onRemoteChange: (value: boolean) => void;
  source: RunSource;
  onSourceChange: (value: RunSource) => void;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
      {children}
    </span>
  );
}

export function RunSetupForm({
  query,
  onQueryChange,
  location,
  onLocationChange,
  remote,
  onRemoteChange,
  source,
  onSourceChange,
}: RunSetupFormProps) {
  return (
    <Card className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <FieldLabel>Job title / keywords</FieldLabel>
        <Input
          icon={<MagnifyingGlassIcon size={16} />}
          placeholder="Junior Software Engineer, React"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <FieldLabel>Location</FieldLabel>
        <Input
          icon={<MapPinIcon size={16} />}
          placeholder="United States"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </label>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <HouseIcon size={16} className="text-text-secondary" />
          Remote roles only
        </span>
        <Switch checked={remote} onCheckedChange={onRemoteChange} label="Remote roles only" />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Source</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSourceChange('auto')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors',
              source === 'auto'
                ? 'border-accent bg-accent text-white'
                : 'border-border text-text-secondary hover:bg-elevated',
            )}
          >
            <BroadcastIcon size={16} />
            Auto-fetch
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm font-semibold text-text-secondary opacity-50"
          >
            <ClipboardTextIcon size={16} />
            Paste · soon
          </button>
        </div>
      </div>
    </Card>
  );
}

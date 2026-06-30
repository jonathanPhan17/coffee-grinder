import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  FilePdfIcon,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ResumeProfile } from '@/types/domain';

interface ResumeFileCardProps {
  profile: ResumeProfile;
  onReupload: () => void;
}

export function ResumeFileCard({ profile, onReupload }: ResumeFileCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated text-accent">
        <FilePdfIcon size={24} weight="fill" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{profile.fileName}</span>
          <Badge tone="success">
            <CheckCircleIcon size={12} weight="fill" />
            Parsed
          </Badge>
        </div>
        <span className="text-sm text-text-secondary">
          {profile.pages} page{profile.pages === 1 ? '' : 's'} · {profile.sizeKb} KB
        </span>
      </div>

      <Button variant="secondary" size="sm" onClick={onReupload}>
        <ArrowCounterClockwiseIcon size={14} weight="bold" />
        Re-upload
      </Button>
    </Card>
  );
}

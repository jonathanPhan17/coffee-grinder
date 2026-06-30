import { SparkleIcon } from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import type { ResumeProfile } from '@/types/domain';

interface ProfileSummaryProps {
  profile: ResumeProfile;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-accent">
        <SparkleIcon size={18} weight="fill" />
        <span className="font-display text-lg font-semibold text-text">
          What we picked up
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Target role" value={profile.targetRole} />
        <Field label="Experience" value={profile.experience} />
        <Field label="Education" value={profile.education} />
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-elevated px-3 py-1 text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
}

import { useNavigate } from 'react-router';
import {
  ArrowSquareOutIcon,
  BuildingsIcon,
  MapPinIcon,
  NotePencilIcon,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { fitTierLabel, scoreTone } from '@/lib/presentation';
import type { Match, Salary } from '@/types/domain';

function formatSalary(salary?: Salary): string | null {
  if (!salary) return null;
  const k = (n?: number) => (n != null ? `$${Math.round(n / 1000)}k` : '');
  if (salary.min != null && salary.max != null) return `${k(salary.min)}–${k(salary.max)}`;
  return k(salary.min ?? salary.max) || null;
}

interface ScoreHeaderProps {
  match: Match;
}

export function ScoreHeader({ match }: ScoreHeaderProps) {
  const navigate = useNavigate();
  const { posting } = match;
  const salary = formatSalary(posting.salary);
  const mustHaves = match.evidence.filter((e) => e.group === 'must_have');
  const mustMet = mustHaves.filter((e) => e.verdict === 'met').length;

  return (
    <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated font-display text-xl font-semibold">
            {posting.company.charAt(0)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold">{posting.title}</h1>
              <Badge tone={scoreTone(match.score)}>{fitTierLabel[match.fitTier]}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <BuildingsIcon size={14} />
                {posting.company}
              </span>
              {posting.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon size={14} />
                  {posting.location}
                </span>
              )}
              {salary && <span>{salary}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => window.open(posting.applyUrl, '_blank', 'noopener,noreferrer')}
          >
            <ArrowSquareOutIcon size={16} weight="bold" />
            Apply on {posting.company}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`/matches/${match.id}/cover-letter`)}
          >
            <NotePencilIcon size={16} weight="bold" />
            Draft cover letter
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        <ScoreRing score={match.score} size={96} strokeWidth={7} label="MATCH" />
        <span className="text-xs text-text-secondary">
          {mustMet} of {mustHaves.length} must-haves met
        </span>
      </div>
    </Card>
  );
}

import { useNavigate } from 'react-router';
import {
  ArrowSquareOutIcon,
  BuildingsIcon,
  FileTextIcon,
  MapPinIcon,
  NotePencilIcon,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { fitTierLabel, scoreTone } from '@/lib/presentation';
import type { Match } from '@/types/domain';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const { posting } = match;

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <ScoreRing score={match.score} label="FIT" />
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-elevated font-display text-lg font-semibold">
          {posting.company.charAt(0)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{posting.title}</h3>
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
        </div>
        <p className="text-sm">{match.summary}</p>
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col">
        <Button size="sm" onClick={() => navigate(`/matches/${match.id}`)}>
          <FileTextIcon size={14} weight="bold" />
          View scorecard
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(posting.applyUrl, '_blank', 'noopener,noreferrer')}
          >
            <ArrowSquareOutIcon size={14} weight="bold" />
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Draft cover letter"
            onClick={() => navigate(`/matches/${match.id}/cover-letter`)}
          >
            <NotePencilIcon size={16} weight="bold" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

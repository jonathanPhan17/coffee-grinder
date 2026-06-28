import { useParams } from 'react-router';
import { PageStub } from '@/components/layout/PageStub';

export function ScorecardPage() {
  const { matchId } = useParams();
  return (
    <PageStub
      eyebrow="Match scorecard"
      title="Why this is a fit — and what’s missing"
      description={`The showpiece (match ${matchId ?? ''}): an explainable, per-criterion breakdown of the score.`}
      planned="Header with overall score + Apply/Draft cover letter, the gaps callout, and MUST-HAVES / NICE-TO-HAVES / DEALBREAKERS sections with expandable evidence + AI reasoning per criterion."
    />
  );
}

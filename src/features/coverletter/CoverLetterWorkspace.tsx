import { useState } from 'react';
import {
  ArrowClockwiseIcon,
  CheckIcon,
  LightbulbIcon,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DraftHistory } from './DraftHistory';
import { LetterEditor } from './LetterEditor';
import { ToneToggle } from './ToneToggle';
import { generateCoverLetter, makeItLandTips } from './generateCoverLetter';
import { mockCoverLetterDrafts } from '@/mocks/fixtures';
import type { CoverLetterDraft, CoverLetterTone, Match } from '@/types/domain';

interface CoverLetterWorkspaceProps {
  match: Match;
}

export function CoverLetterWorkspace({ match }: CoverLetterWorkspaceProps) {
  const [tone, setTone] = useState<CoverLetterTone>('friendly');
  const [body, setBody] = useState(() => generateCoverLetter(match, 'friendly'));
  const [drafts, setDrafts] = useState<CoverLetterDraft[]>(mockCoverLetterDrafts);
  const [copied, setCopied] = useState(false);

  const tips = makeItLandTips(match);

  const handleToneChange = (next: CoverLetterTone) => {
    setTone(next);
    setBody(generateCoverLetter(match, next));
  };

  const handleSave = () => {
    const version = (drafts[0]?.version ?? 0) + 1;
    setDrafts([
      { version, tone, body, createdAt: new Date().toISOString() },
      ...drafts,
    ]);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRestore = (draft: CoverLetterDraft) => {
    setTone(draft.tone);
    setBody(draft.body);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cover letter"
        title="A letter tailored to this role"
        description={`${match.posting.company} · ${match.posting.title}`}
        actions={
          <>
            <ToneToggle tone={tone} onChange={handleToneChange} />
            <Button variant="secondary" size="sm" onClick={() => setBody(generateCoverLetter(match, tone))}>
              <ArrowClockwiseIcon size={14} weight="bold" />
              Regenerate
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <LetterEditor
          value={body}
          onChange={setBody}
          onCopy={handleCopy}
          onSave={handleSave}
          copied={copied}
        />

        <div className="flex flex-col gap-6">
          <DraftHistory drafts={drafts} onRestore={handleRestore} />

          <Card className="flex flex-col gap-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <LightbulbIcon size={16} className="text-accent" />
              Make it land
            </span>
            <ul className="flex flex-col gap-2">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckIcon size={14} className="mt-0.5 shrink-0 text-success" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

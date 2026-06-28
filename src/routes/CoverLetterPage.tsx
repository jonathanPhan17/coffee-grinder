import { useParams } from 'react-router';
import { PageStub } from '@/components/layout/PageStub';

export function CoverLetterPage() {
  const { matchId } = useParams();
  return (
    <PageStub
      eyebrow="Cover letter"
      title="A letter tailored to this role"
      description={`AI-drafted from your résumé and the posting (match ${matchId ?? ''}), editable, and saved with version history.`}
      planned="Editable letter body, tone toggle (friendly/formal), regenerate, copy/save, and a saved-drafts version list."
    />
  );
}

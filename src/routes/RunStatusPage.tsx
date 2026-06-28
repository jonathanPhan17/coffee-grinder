import { useParams } from 'react-router';
import { PageStub } from '@/components/layout/PageStub';

export function RunStatusPage() {
  const { runId } = useParams();
  return (
    <PageStub
      eyebrow="Brewing"
      title="Screening your matches…"
      description={`Run ${runId ?? ''} — a reassuring brewing/grinding progress state while the pipeline fetches and scores each posting.`}
      planned="Brewing animation, “Screening job 7 of 20…” counter, overall progress bar, and a live step checklist (fetched → parsed → scoring)."
    />
  );
}

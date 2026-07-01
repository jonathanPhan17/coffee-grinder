import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';

const UploadPage = lazy(() =>
  import('@/routes/UploadPage').then((m) => ({ default: m.UploadPage })),
);
const RunSetupPage = lazy(() =>
  import('@/routes/RunSetupPage').then((m) => ({ default: m.RunSetupPage })),
);
const RunStatusPage = lazy(() =>
  import('@/routes/RunStatusPage').then((m) => ({ default: m.RunStatusPage })),
);
const ResultsPage = lazy(() =>
  import('@/routes/ResultsPage').then((m) => ({ default: m.ResultsPage })),
);
const ScorecardPage = lazy(() =>
  import('@/routes/ScorecardPage').then((m) => ({ default: m.ScorecardPage })),
);
const CoverLetterPage = lazy(() =>
  import('@/routes/CoverLetterPage').then((m) => ({ default: m.CoverLetterPage })),
);
const BoardPage = lazy(() =>
  import('@/routes/BoardPage').then((m) => ({ default: m.BoardPage })),
);
const NotFoundPage = lazy(() =>
  import('@/routes/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<UploadPage />} />
        <Route path="runs/new" element={<RunSetupPage />} />
        <Route path="runs/:runId" element={<RunStatusPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="matches/:matchId" element={<ScorecardPage />} />
        <Route path="matches/:matchId/cover-letter" element={<CoverLetterPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

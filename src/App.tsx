import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';

const UploadPage = lazy(() => import('@/routes/UploadPage'));
const RunSetupPage = lazy(() => import('@/routes/RunSetupPage'));
const RunStatusPage = lazy(() => import('@/routes/RunStatusPage'));
const ResultsPage = lazy(() => import('@/routes/ResultsPage'));
const ScorecardPage = lazy(() => import('@/routes/ScorecardPage'));
const CoverLetterPage = lazy(() => import('@/routes/CoverLetterPage'));
const BoardPage = lazy(() => import('@/routes/BoardPage'));
const NotFoundPage = lazy(() => import('@/routes/NotFoundPage'));

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

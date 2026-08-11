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

// Dev-only component gallery. import.meta.env.DEV is compile-time false in a
// production build, so the route (and the whole chunk) is dropped from it.
const GalleryPage = import.meta.env.DEV ? lazy(() => import('@/routes/GalleryPage')) : null;

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
        {GalleryPage && <Route path="dev/gallery" element={<GalleryPage />} />}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

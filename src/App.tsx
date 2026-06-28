import { Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { UploadPage } from '@/routes/UploadPage';
import { RunSetupPage } from '@/routes/RunSetupPage';
import { RunStatusPage } from '@/routes/RunStatusPage';
import { ResultsPage } from '@/routes/ResultsPage';
import { ScorecardPage } from '@/routes/ScorecardPage';
import { CoverLetterPage } from '@/routes/CoverLetterPage';
import { BoardPage } from '@/routes/BoardPage';
import { NotFoundPage } from '@/routes/NotFoundPage';

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

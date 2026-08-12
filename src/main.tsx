import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/nunito-sans'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/lib/theme/ThemeProvider'
import { queryClient } from '@/lib/api/queryClient'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { ResumeProvider } from '@/features/resume/ResumeProvider'

// AuthProvider sits above ResumeProvider (whose hydration query waits on auth)
// and outside BrowserRouter — it navigates with window.location, never
// useNavigate, so it stays router-free.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ResumeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ResumeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)

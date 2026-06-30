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
import { ResumeProvider } from '@/features/resume/ResumeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ResumeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ResumeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)

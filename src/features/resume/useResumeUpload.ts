import { useCallback, useState } from 'react';
import { mockProfile } from '@/mocks/fixtures';
import { useResume } from './useResume';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

type UploadStatus = 'idle' | 'parsing' | 'error';

function validate(file: File): string | null {
  const ok = ACCEPTED_TYPES.includes(file.type) || /\.(pdf|docx)$/i.test(file.name);
  if (!ok) return 'Please upload a PDF or DOCX file.';
  if (file.size > MAX_SIZE) return 'That file is over the 10 MB limit.';
  return null;
}

export function useResumeUpload() {
  const { setProfile } = useResume();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    (file: File) => {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }
      setError(null);
      setStatus('parsing');
      // Simulated parse until the backend exists; swaps for an axios + S3 upload.
      setTimeout(() => {
        setProfile({
          ...mockProfile,
          fileName: file.name,
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
        });
        setStatus('idle');
      }, 1200);
    },
    [setProfile],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, upload, reset };
}

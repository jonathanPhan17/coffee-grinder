import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  createResumeUpload,
  getResumeProfile,
  uploadResumeFile,
} from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/queryKeys';
import { useResume } from './useResume';

const MAX_SIZE = 10 * 1024 * 1024;
const PDF_TYPE = 'application/pdf';

// The parse Lambda (pdf-parse + one Bedrock call) typically lands in 5–15s. The
// timeout matters because the backend has no parseFailed state yet: without it, a
// failed parse would leave this hook polling forever.
const POLL_TIMEOUT_MS = 90_000;
const POLL_INITIAL_DELAY_MS = 1_500;
const POLL_MAX_DELAY_MS = 6_000;

type UploadStatus = 'idle' | 'requesting' | 'uploading' | 'parsing' | 'error';

function validate(file: File): string | null {
  // The backend accepts only PDF (415 otherwise), so reject everything else here.
  const ok = file.type === PDF_TYPE || /\.pdf$/i.test(file.name);
  if (!ok) return 'Please upload a PDF file.';
  if (file.size > MAX_SIZE) return 'That file is over the 10 MB limit.';
  return null;
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export function useResumeUpload() {
  const { setProfile } = useResume();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const upload = useCallback(
    async (file: File) => {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;
      setError(null);
      // Mirrors the status state; the catch below needs the stage synchronously.
      let stage: UploadStatus = 'requesting';

      try {
        setStatus('requesting');
        const { uploadUrl } = await createResumeUpload({
          fileName: file.name,
          contentType: PDF_TYPE,
          sizeBytes: file.size,
        });
        if (signal.aborted) return;

        stage = 'uploading';
        setStatus('uploading');
        await uploadResumeFile(uploadUrl, file, PDF_TYPE);
        if (signal.aborted) return;

        // S3 has the file; EventBridge is waking the parse worker. Poll the profile
        // with a widening interval until parsed flips true.
        stage = 'parsing';
        setStatus('parsing');
        const deadline = Date.now() + POLL_TIMEOUT_MS;
        let delay = POLL_INITIAL_DELAY_MS;
        while (Date.now() < deadline) {
          await sleep(delay, signal);
          delay = Math.min(delay * 1.5, POLL_MAX_DELAY_MS);
          // A transient failed poll must not kill the 90s wait — skip and retry.
          const profile = await getResumeProfile().catch(() => null);
          if (signal.aborted) return;
          if (profile?.parsed) {
            queryClient.setQueryData(queryKeys.resume.profile, profile);
            setProfile(profile);
            setStatus('idle');
            return;
          }
        }
        setError(
          'Reading your résumé is taking too long. The file may not be readable — try a different PDF.',
        );
        setStatus('error');
      } catch (err: unknown) {
        if (signal.aborted) return;
        setError(uploadErrorMessage(err, stage));
        setStatus('error');
      }
    },
    [queryClient, setProfile],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, upload, reset };
}

function uploadErrorMessage(err: unknown, stage: UploadStatus): string {
  // S3 failures never carry user-appropriate text (XML error codes), so the PUT
  // stage always gets the friendly message.
  if (stage === 'uploading') {
    return 'The upload did not finish. Check your connection and try again.';
  }
  // Our API's own message (e.g. the 413's "Resume must be 10 MB or smaller") beats
  // anything generic we could say.
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data;
    if (data?.error) return data.error;
  }
  return 'Could not start the upload. Check your connection and try again.';
}

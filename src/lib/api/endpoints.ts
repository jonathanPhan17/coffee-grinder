import axios from 'axios';
import type { CoverLetterDraft, Match, ResumeProfile, Run } from '@/types/domain';
import { mockCoverLetterDrafts } from '@/mocks/fixtures';
import { client } from './client';

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** POST /resume — mint a presigned S3 upload URL and register the pending profile. */
export function createResumeUpload(input: {
  fileName: string;
  contentType: string;
  sizeBytes: number;
}): Promise<{ uploadUrl: string; key: string }> {
  return client
    .post<{ uploadUrl: string; key: string }>('/resume', input)
    .then((r) => r.data);
}

/**
 * PUT the file straight to S3 with the presigned URL. Bare axios, not `client`:
 * different origin, and the signature only matches a request carrying exactly the
 * content-type and byte size declared to POST /resume.
 */
export function uploadResumeFile(
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> {
  return axios
    .put(uploadUrl, file, { headers: { 'Content-Type': contentType } })
    .then(() => undefined);
}

/** GET /resume — the stored profile; null before the first upload (404). */
export function getResumeProfile(): Promise<ResumeProfile | null> {
  return client
    .get<ResumeProfile>('/resume')
    .then((r) => r.data)
    .catch((err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      throw err;
    });
}

/** POST /runs — start a screening run, returns the run id. */
export function startRun(input: {
  query: string;
  location?: string;
  remote?: boolean;
  count: number;
}): Promise<Run> {
  return client.post<Run>('/runs', input).then((r) => r.data);
}

/** GET /runs/{id} — poll run status. */
export function getRun(id: string): Promise<Run> {
  return client.get<Run>(`/runs/${id}`).then((r) => r.data);
}

/** GET /matches?run=… — list scored matches, sorted best first. */
export function listMatches(runId: string): Promise<Match[]> {
  return client.get<Match[]>('/matches', { params: { run: runId } }).then((r) => r.data);
}

/** GET /matches — every match across all runs, the pipeline board view. */
export function listAllMatches(): Promise<Match[]> {
  return client.get<Match[]>('/matches').then((r) => r.data);
}

/** GET /matches/{id} — one match with its evidence scorecard. */
export function getMatch(id: string): Promise<Match | undefined> {
  return client.get<Match>(`/matches/${id}`).then((r) => r.data);
}

/** PATCH /matches/{id} — update pipeline status. */
export function updateMatchStatus(
  id: string,
  status: Match['status'],
): Promise<Match | undefined> {
  return client.patch<Match>(`/matches/${id}`, { status }).then((r) => r.data);
}

/** POST /coverletter — generate/save a tailored cover letter for a match. */
export function listCoverLetterDrafts(
  _matchId: string,
): Promise<CoverLetterDraft[]> {
  //  the last mock standing.
  return delay(mockCoverLetterDrafts);
  // return client.get<CoverLetterDraft[]>(`/matches/${_matchId}/coverletters`).then((r) => r.data);
}

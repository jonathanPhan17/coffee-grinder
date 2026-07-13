import type { CoverLetterDraft, Match, Run } from '@/types/domain';
import { mockCoverLetterDrafts } from '@/mocks/fixtures';
import { client } from './client';

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
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

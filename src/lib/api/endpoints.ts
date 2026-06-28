import type { CoverLetterDraft, Match, Run } from '@/types/domain';
import {
  mockCoverLetterDrafts,
  mockMatches,
  mockRun,
} from '@/mocks/fixtures';
// import { client } from './client';

const MOCK = true;

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
  if (MOCK) return delay({ ...mockRun, ...input, status: 'queued' });
  // return client.post<Run>('/runs', input).then((r) => r.data);
  throw new Error('not implemented');
}

/** GET /runs/{id} — poll run status. */
export function getRun(_id: string): Promise<Run> {
  if (MOCK) return delay(mockRun);
  // return client.get<Run>(`/runs/${_id}`).then((r) => r.data);
  throw new Error('not implemented');
}

/** GET /matches?run=… — list scored matches, sorted best first. */
export function listMatches(_runId: string): Promise<Match[]> {
  if (MOCK) {
    return delay([...mockMatches].sort((a, b) => b.score - a.score));
  }
  // return client.get<Match[]>('/matches', { params: { run: _runId } }).then((r) => r.data);
  throw new Error('not implemented');
}

/** GET /matches/{id} — one match with its evidence scorecard. */
export function getMatch(id: string): Promise<Match | undefined> {
  if (MOCK) return delay(mockMatches.find((m) => m.id === id));
  // return client.get<Match>(`/matches/${id}`).then((r) => r.data);
  throw new Error('not implemented');
}

/** PATCH /matches/{id} — update pipeline status. */
export function updateMatchStatus(
  id: string,
  status: Match['status'],
): Promise<Match | undefined> {
  if (MOCK) {
    const match = mockMatches.find((m) => m.id === id);
    return delay(match ? { ...match, status } : undefined, 150);
  }
  // return client.patch<Match>(`/matches/${id}`, { status }).then((r) => r.data);
  throw new Error('not implemented');
}

/** POST /coverletter — generate/save a tailored cover letter for a match. */
export function listCoverLetterDrafts(
  _matchId: string,
): Promise<CoverLetterDraft[]> {
  if (MOCK) return delay(mockCoverLetterDrafts);
  // return client.get<CoverLetterDraft[]>(`/matches/${_matchId}/coverletters`).then((r) => r.data);
  throw new Error('not implemented');
}

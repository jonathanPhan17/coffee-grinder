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

// ── MOCK run simulation ──────────────────────────────────────────────────
// Fakes a run advancing over time so the processing screen has real progress
// to poll. DELETE this whole block when the backend exists; startRun/getRun
// then just call the real API (the commented client.* lines below).
const SIM_FETCH_MS = 1500;
const SIM_TOTAL_MS = 9000;
const runSim = new Map<string, { start: number; count: number }>();

function ensureSim(id: string): { start: number; count: number } {
  let sim = runSim.get(id);
  if (!sim) {
    sim = { start: Date.now(), count: mockRun.count };
    runSim.set(id, sim);
  }
  return sim;
}

function simulateRun(id: string): Run {
  const { start, count } = ensureSim(id);
  const elapsed = Date.now() - start;

  let status: Run['status'];
  let screened: number;
  if (elapsed < SIM_FETCH_MS) {
    status = 'fetching';
    screened = 0;
  } else if (elapsed < SIM_TOTAL_MS) {
    status = 'screening';
    const ratio = (elapsed - SIM_FETCH_MS) / (SIM_TOTAL_MS - SIM_FETCH_MS);
    screened = Math.min(count, Math.floor(ratio * count));
  } else {
    status = 'done';
    screened = count;
  }
  return { ...mockRun, id, status, count, screened };
}
// ─────────────────────────────────────────────────────────────────────────

/** POST /runs — start a screening run, returns the run id. */
export function startRun(input: {
  query: string;
  location?: string;
  remote?: boolean;
  count: number;
}): Promise<Run> {
  if (MOCK) {
    // MOCK: register a simulated run; the real call is the commented line below.
    const id = `run_${Date.now()}`;
    runSim.set(id, { start: Date.now(), count: input.count });
    return delay({ ...mockRun, ...input, id, status: 'queued', screened: 0 });
  }
  // return client.post<Run>('/runs', input).then((r) => r.data);
  throw new Error('not implemented');
}

/** GET /runs/{id} — poll run status. */
export function getRun(id: string): Promise<Run> {
  if (MOCK) return delay(simulateRun(id), 150);
  // return client.get<Run>(`/runs/${id}`).then((r) => r.data);
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

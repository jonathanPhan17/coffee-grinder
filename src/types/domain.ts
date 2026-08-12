/* ── Job postings (§6) ───────────────────────────────────────────────── */

export type JobSourceKind = 'apify' | 'pasted';

export interface Salary {
  min?: number;
  max?: number;
  currency?: string;
  interval?: 'year' | 'month' | 'hour';
}

export interface JobPosting {
  sourceId: string;
  source: JobSourceKind;
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  description: string;
  applyUrl: string;
  salary?: Salary;
  postedAt?: string;
}

/* ── Runs (§4, §7) ───────────────────────────────────────────────────── */

export type RunStatus = 'queued' | 'fetching' | 'screening' | 'done' | 'error';

export interface Run {
  id: string;
  status: RunStatus;
  /** N — how many postings to screen. */
  count: number;
  query: string;
  location?: string;
  remote?: boolean;
  /** How many have finished screening so far (for the brewing progress UI). */
  screened?: number;
  /** Postings the pipeline couldn't screen and skipped (surfaced as a results banner). */
  failed?: number;
  createdAt: string;
}

/* -- Run quotas -------------------------------------------------------- */

/** One rolling limit window (per-user monthly or site-wide daily). */
export interface QuotaWindow {
  used: number;
  limit: number;
  remaining: number;
  /** ISO timestamp of the moment this window's counter resets. */
  resetsAt: string;
}

/** GET /quota - remaining run allowance for the signed-in user. */
export interface Quota {
  monthly: QuotaWindow;
  daily: QuotaWindow;
}

/** Body of the 429 that POST /runs returns when a run quota is exhausted. */
export interface QuotaExceededBody {
  error: string;
  code: 'monthly_quota' | 'daily_cap';
  limit: number;
  resetsAt: string;
}

/* ── Matches & scorecards (§5) ───────────────────────────────────────── */

export type Verdict = 'met' | 'partial' | 'not_met';
export type CriterionGroup = 'must_have' | 'nice_to_have' | 'dealbreaker';
export type FitTier = 'strong' | 'good' | 'fair' | 'weak';

export interface CriterionEvidence {
  id: string;
  group: CriterionGroup;
  /** The requirement text, e.g. "Proficient in React". */
  criterion: string;
  verdict: Verdict;
  /** 0–1; rendered as a low/medium/high confidence indicator. */
  confidence: number;
  /** Supporting snippet pulled from the resume (empty when not_met). */
  snippet?: string;
  /** Short adjudication line. */
  reasoning: string;
}

export type PipelineStatus =
  | 'matched'
  | 'shortlisted'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected';

export interface Match {
  id: string;
  runId: string;
  posting: JobPosting;
  /** Overall fit score, 0–100. */
  score: number;
  fitTier: FitTier;
  /** One-line fit summary for the results card. */
  summary: string;
  evidence: CriterionEvidence[];
  status: PipelineStatus;
}

/* ── Cover letters (§7: LETTER#<version>) ────────────────────────────── */

export type CoverLetterTone = 'friendly' | 'formal';

export interface CoverLetterDraft {
  version: number;
  tone: CoverLetterTone;
  body: string;
  createdAt: string;
}

/* ── Resume profile (§4, §7: PROFILE) ────────────────────────────────── */

export interface ResumeProfile {
  fileName: string;
  sizeKb: number;
  pages: number;
  parsed: boolean;
  targetRole: string;
  experience: string;
  education: string;
  skills: string[];
}

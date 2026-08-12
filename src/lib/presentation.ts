/**
 * Single source of truth for domain → visual mappings.
 *
 * Results, Scorecard, and Board all render scores, verdicts, and fit tiers — if
 * each derived its own colors/labels they would drift and break the semantic-
 * color rules. Everything visual about those values is decided here.
 */
import type { CriterionGroup, FitTier, Verdict } from '@/types/domain';
import type { Tone } from '@/types/ui';

export function scoreTone(score: number): Tone {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

/** Remaining free runs -> indicator tone: plenty reads calm, the last run is
 *  a nudge, zero matches the disabled CTA and the reset-date line. */
export function quotaTone(remaining: number): Tone {
  if (remaining <= 0) return 'danger';
  if (remaining === 1) return 'warning';
  return 'success';
}

export const verdictDisplay: Record<Verdict, { label: string; tone: Tone }> = {
  met: { label: 'Met', tone: 'success' },
  partial: { label: 'Partial', tone: 'warning' },
  not_met: { label: 'Not met', tone: 'danger' },
};

/**
 * Mirrors the backend's dealbreaker cap gate (score.ts DEALBREAKER_CONFIDENCE):
 * below this confidence a not_met dealbreaker did NOT cap the score — the model
 * couldn't verify it from the résumé ("unknown"), it didn't find a violation.
 */
const DEALBREAKER_CONFIDENCE = 0.7;

/** True when a dealbreaker miss means "couldn't tell", not "failed". */
export function isUnconfirmedDealbreaker(e: {
  group: CriterionGroup;
  verdict: Verdict;
  confidence: number;
}): boolean {
  return (
    e.group === 'dealbreaker' && e.verdict === 'not_met' && e.confidence < DEALBREAKER_CONFIDENCE
  );
}

/** A met dealbreaker reads as "Cleared"; an unconfirmable one as "Can't confirm"
 *  (amber, matching the fact that it didn't cap the score); otherwise the
 *  verdict's own badge. */
export function criterionBadge(e: {
  group: CriterionGroup;
  verdict: Verdict;
  confidence: number;
}): { label: string; tone: Tone } {
  if (e.group === 'dealbreaker' && e.verdict === 'met') {
    return { label: 'Cleared', tone: 'success' };
  }
  if (isUnconfirmedDealbreaker(e)) {
    return { label: "Can't confirm", tone: 'warning' };
  }
  return verdictDisplay[e.verdict];
}

/** Fit tier → label only; the color comes from scoreTone(score) so it never
 *  contradicts the numeric score. */
export const fitTierLabel: Record<FitTier, string> = {
  strong: 'Strong fit',
  good: 'Good fit',
  fair: 'Fair fit',
  weak: 'Weak fit',
};

/** Confidence (0–1) → coarse label for the scorecard confidence indicator. */
export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return 'High conf.';
  if (confidence >= 0.45) return 'Medium conf.';
  return 'Low conf.';
}

/** Tailwind text-color utility per tone — for rings, dots, and icons where a
 *  solid fill (Badge) isn't wanted. */
export const toneText: Record<Tone, string> = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  neutral: 'text-text-secondary',
};

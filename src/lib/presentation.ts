/**
 * Single source of truth for domain → visual mappings.
 *
 * Results, Scorecard, and Board all render scores, verdicts, and fit tiers — if
 * each derived its own colors/labels they would drift and break the semantic-
 * color rules. Everything visual about those values is decided here.
 */
import type { FitTier, Verdict } from '@/types/domain';
import type { Tone } from '@/types/ui';

export function scoreTone(score: number): Tone {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

export const verdictDisplay: Record<Verdict, { label: string; tone: Tone }> = {
  met: { label: 'Met', tone: 'success' },
  partial: { label: 'Partial', tone: 'warning' },
  not_met: { label: 'Not met', tone: 'danger' },
};

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

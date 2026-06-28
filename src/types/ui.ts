/**
 * Cross-cutting UI types — shared by primitives (components/ui) and by the
 * domain→visual mappings in lib/presentation.ts. Kept here (a dependency leaf)
 * so neither layer has to import from the other.
 */

/** Semantic color tone used by Badge fills, score rings, status dots, etc. */
export type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

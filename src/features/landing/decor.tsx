import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Landing garnish — coffee-ring stains, roasted beans, and soft organic blobs
 * that break up the flat band colors. The vocabulary stays strictly coffee:
 * a ring is the mark a hot mug leaves, blobs are spilled milk and crema.
 * Every piece is decorative (aria-hidden, pointer-events-none), positioned by
 * the caller, and colored through currentColor / theme tokens so both roasts
 * work untouched.
 */

/**
 * The mark a mug leaves on the table: a broad faint ring, a crisp inner edge
 * with a lift-off gap, a stray outer run, and splatter. Strokes inherit
 * currentColor — set a text-* token (usually crema) at the call site.
 */
export function CoffeeRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={cn('pointer-events-none absolute', className)}>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="80" strokeWidth="14" opacity="0.35" />
        {/* r=71 → circumference ≈446; the 46 gap is where the mug lifted */}
        <circle
          cx="100"
          cy="100"
          r="71"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="400 46"
          transform="rotate(-30 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          strokeWidth="2"
          opacity="0.5"
          strokeLinecap="round"
          strokeDasharray="30 523"
          transform="rotate(120 100 100)"
        />
      </g>
      <g fill="currentColor">
        <circle cx="176" cy="60" r="5" opacity="0.6" />
        <circle cx="187" cy="76" r="3" opacity="0.45" />
        <circle cx="22" cy="150" r="4" opacity="0.5" />
      </g>
    </svg>
  );
}

/**
 * One roasted bean — outline plus center crease, the same drawing language as
 * the espresso band's divider. Size, rotate, and tint at the call site.
 */
export function Bean({ className }: { className?: string }) {
  return (
    <svg viewBox="-16 -12 32 24" aria-hidden="true" className={cn('pointer-events-none absolute', className)}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse rx="13" ry="9" />
        <path d="M -9,-2 C -3.5,-4.5 3.5,4.5 9,2" />
      </g>
    </svg>
  );
}

/* Two hand-tuned radius sets so neighboring blobs never read as clones.
 * Inline style, not an arbitrary Tailwind class: the slash syntax is too easy
 * to mangle in a class string. */
const BLOB_RADII: Record<'a' | 'b', CSSProperties> = {
  a: { borderRadius: '62% 38% 56% 44% / 45% 58% 42% 55%' },
  b: { borderRadius: '38% 62% 45% 55% / 58% 44% 56% 42%' },
};

/**
 * Soft organic blob — spilled milk on the band. Size, position, and bg-* tone
 * at the call site; `shape` picks one of two radius sets.
 */
export function Blob({ className, shape = 'a' }: { className?: string; shape?: 'a' | 'b' }) {
  return (
    <div
      aria-hidden
      style={BLOB_RADII[shape]}
      className={cn('pointer-events-none absolute', className)}
    />
  );
}

/**
 * Garnish layer for a full-bleed Band: clips its children to the band's box so
 * stains and blobs crop at the band edge instead of bleeding into neighbors.
 * The band's content column must be `relative` to paint above this layer.
 */
export function BandDecor({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {children}
    </div>
  );
}

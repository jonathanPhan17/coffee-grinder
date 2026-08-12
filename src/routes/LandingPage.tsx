import type { CSSProperties, ReactNode } from 'react';
import {
  CoffeeIcon,
  KanbanIcon,
  ListChecksIcon,
  PenNibIcon,
  QuotesIcon,
  ShieldCheckIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeroScorecard } from '@/features/landing/HeroScorecard';
import { BandDecor, Bean, Blob, CoffeeRing } from '@/features/landing/decor';
import { Reveal } from '@/features/landing/Reveal';
import { cn } from '@/lib/utils/cn';
import { useAuthSession } from '@/lib/auth/useAuthSession';
import doodleTile from '@/assets/coffee-doodle-tile.svg';
import spotResume from '@/assets/spot-1-resume-drop.svg';
import spotGrinding from '@/assets/spot-2-grinding.svg';
import spotScorecard from '@/assets/spot-3-scorecard.svg';

// Hero elements cascade in on load; everything below reveals on scroll.
const rise = (delayMs: number): { className: string; style: CSSProperties } => ({
  className: 'motion-safe:animate-landing-rise',
  style: { animationDelay: `${delayMs}ms` },
});

// The scorecards' verdict-color language, reused on the landing so the
// marketing page speaks the same palette as the product.
const tones = {
  accent: { icon: 'text-accent', stripe: 'border-l-accent' },
  crema: { icon: 'text-crema', stripe: 'border-l-crema' },
  success: { icon: 'text-success', stripe: 'border-l-success' },
  warning: { icon: 'text-warning', stripe: 'border-l-warning' },
  danger: { icon: 'text-danger', stripe: 'border-l-danger' },
} as const;

/**
 * A full-bleed color band. AppShell keeps every page in a centered max-w-6xl
 * column; the band escapes it — 100vw re-centered over the column, which works
 * because the column is viewport-centered — and body overflow-x:clip swallows
 * the scrollbar-width overshoot. `dark` pins the band to dark-roast tokens in
 * both themes via .roast-scope: one espresso section in a light page.
 */
function Band({
  dark,
  className,
  children,
}: {
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'relative left-1/2 w-screen -translate-x-1/2',
        // text-text re-resolves the inherited color against the scoped tokens.
        dark && 'roast-scope text-text',
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Ornamental rule — thin crema line with three beans (artwork from
 * src/assets/coffee-divider.svg, viewBox tightened to the drawing). Colors
 * stay literal by design: crema and cinnamon are drawn for the espresso band.
 */
function CoffeeDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="360 32 720 36" aria-hidden="true" className={className}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="368" cy="50" r="2.2" fill="#d4a373" stroke="none" />
        <path d="M 380,50 L 646,50" stroke="#d4a373" strokeWidth="2" />
        <g transform="translate(679,50) rotate(-18)" stroke="#d4a373" strokeWidth="2">
          <ellipse rx="8.5" ry="6" />
          <path d="M -6,-1.2 C -2.5,-3 2.5,3 6,1.2" />
        </g>
        <g transform="translate(720,50) rotate(-18)" stroke="#b5651d" strokeWidth="2">
          <ellipse rx="13" ry="9" />
          <path d="M -9,-2 C -3.5,-4.5 3.5,4.5 9,2" />
        </g>
        <g transform="translate(761,50) rotate(-18)" stroke="#d4a373" strokeWidth="2">
          <ellipse rx="8.5" ry="6" />
          <path d="M -6,-1.2 C -2.5,-3 2.5,3 6,1.2" />
        </g>
        <path d="M 794,50 L 1060,50" stroke="#d4a373" strokeWidth="2" />
        <circle cx="1072" cy="50" r="2.2" fill="#d4a373" stroke="none" />
      </g>
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  tone = 'accent',
  elevated,
  stripe,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone?: keyof typeof tones;
  /** For cards sitting on a surface band. */
  elevated?: boolean;
  /** Echo the scorecard rows' verdict stripe. */
  stripe?: boolean;
  children: ReactNode;
}) {
  return (
    <Card
      elevated={elevated}
      className={cn(
        'flex h-full flex-col gap-3 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1',
        stripe && cn('border-l-4', tones[tone].stripe),
      )}
    >
      <span
        className={cn(
          'grid size-11 place-items-center rounded-lg',
          elevated ? 'bg-surface' : 'bg-elevated',
          tones[tone].icon,
        )}
      >
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-text-secondary">{children}</p>
    </Card>
  );
}

function StepCard({
  step,
  title,
  image,
  children,
}: {
  step: string;
  title: string;
  image: string;
  children: ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col gap-3 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1">
      {/* The spot art is latte-native (cream paper, espresso ink), so it sits
          on a warm crema plate in both themes, like a mounted print. */}
      <div className="grid place-items-center rounded-md bg-crema/20 py-4">
        <img src={image} alt="" className="h-28 w-auto" />
      </div>
      <span className="font-display text-3xl font-semibold text-accent">{step}</span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-text-secondary">{children}</p>
    </Card>
  );
}

export default function LandingPage() {
  const { signIn } = useAuthSession();

  return (
    <div className="flex flex-col gap-16 py-4">
      {/* isolate: the -z-10 garnish must stack inside this section — without
          it, negative z drops to the root context and paints behind the
          AppShell's opaque bg-bg, i.e. invisibly. */}
      <section className="relative isolate flex flex-col gap-8">
        {/* Morning light behind the headline — same pattern as the scorecard's
            glow; the blur is ink overflow and never scrolls. */}
        <div
          aria-hidden
          className="absolute -top-24 -left-32 -z-10 size-120 rounded-full bg-crema/10 blur-3xl"
        />
        {/* A mug was here — stain in the empty top-right of the headline zone.
            Hidden on small screens where the text owns the full width. */}
        <CoffeeRing className="-top-14 right-0 -z-10 hidden w-56 rotate-12 text-crema/60 sm:block" />
        <div className="flex flex-col gap-4">
          <span
            style={rise(0).style}
            className={`${rise(0).className} text-xs font-bold uppercase tracking-widest text-accent`}
          >
            Freshly ground job matches
          </span>
          <h1
            style={rise(60).style}
            className={`${rise(60).className} max-w-3xl font-display text-4xl font-semibold sm:text-5xl`}
          >
            Every job match, scored with receipts.
          </h1>
          <p
            style={rise(120).style}
            className={`${rise(120).className} max-w-2xl text-lg text-text-secondary`}
          >
            Coffee Grinder reads your résumé, screens real postings against it, and hands you an
            honest 0–100 scorecard for each one — every verdict shown with its evidence and
            reasoning. No black-box match percentages.
          </p>
        </div>
        <div style={rise(180).style} className={`${rise(180).className} flex flex-wrap items-center gap-3`}>
          <Button size="lg" onClick={() => signIn('signup')}>
            <CoffeeIcon size={18} weight="fill" />
            Start grinding — it's free
          </Button>
          {/* Styled anchor, not a Button-in-an-a — nested interactive controls are an a11y violation. */}
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 text-base font-semibold transition-colors hover:bg-elevated focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            See how it works
          </a>
        </div>
        <p style={rise(240).style} className={`${rise(240).className} text-sm text-text-secondary`}>
          Free while in beta — 5 runs a month, no card needed.
        </p>
        <div style={rise(300).style} className={`${rise(300).className} relative`}>
          {/* Crema spills behind the floating scorecard; the big one drifts on
              its own beat so the two never move in lockstep. */}
          <Blob className="-top-16 -right-44 -z-10 h-80 w-80 rotate-6 bg-crema/25 motion-safe:animate-hero-float [animation-delay:1.2s]" />
          <Blob shape="b" className="-bottom-16 -left-36 -z-10 h-56 w-56 bg-accent/10" />
          <HeroScorecard />
        </div>
      </section>

      <Band className="bg-surface">
        <BandDecor>
          {/* Smaller and higher on phones so the stain grazes the heading
              instead of sprawling under the whole paragraph. */}
          <CoffeeRing className="-top-28 -right-20 w-64 rotate-12 text-crema/70 sm:-top-24 sm:-right-16 sm:w-80" />
          <Blob shape="b" className="-bottom-28 -left-24 h-72 w-72 bg-bg/60" />
          <Bean className="right-[8%] bottom-9 hidden w-9 rotate-[-24deg] text-crema/80 lg:block" />
          <Bean className="right-[5%] bottom-16 hidden w-6 rotate-15 text-crema/60 lg:block" />
        </BandDecor>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
          <Reveal className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-semibold">Scores you can argue with</h2>
            <p className="max-w-2xl text-text-secondary">
              Most matching tools hand you a percentage and expect trust. Coffee Grinder shows its
              work — so when a score surprises you, you can see exactly why.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            <Reveal delay={0} className="h-full">
              <FeatureCard
                elevated
                tone="success"
                icon={<QuotesIcon size={24} weight="fill" />}
                title="Evidence, quoted"
              >
                When you clear a criterion, the scorecard quotes the line from your résumé that
                earned it — next to what the posting actually asks for.
              </FeatureCard>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <FeatureCard
                elevated
                tone="accent"
                icon={<ListChecksIcon size={24} weight="fill" />}
                title="Verdicts per criterion"
              >
                Must-haves, nice-to-haves, and dealbreakers each get their own call — Met, Partial,
                or Not met — with the AI's reasoning in plain sight.
              </FeatureCard>
            </Reveal>
            <Reveal delay={200} className="h-full">
              <FeatureCard
                elevated
                tone="warning"
                icon={<ShieldCheckIcon size={24} weight="fill" />}
                title="Honest about uncertainty"
              >
                When your résumé doesn't settle a dealbreaker, the scorecard says "Can't confirm"
                instead of guessing — and never quietly ignores it.
              </FeatureCard>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* scroll-mt clears the sticky h-16 NavBar on fragment jumps */}
      {/* isolate for the same reason as the hero: keep -z-10 garnish above
          the AppShell background. */}
      <section id="how-it-works" className="relative isolate flex scroll-mt-20 flex-col gap-6">
        {/* Surface-tone blob under the step cards — the bands' fill, inverted
            onto the page background — plus beans scattered right of the
            heading where the column runs empty. */}
        <Blob className="top-16 -left-52 -z-10 h-104 w-104 -rotate-6 bg-surface" />
        <Blob shape="b" className="-right-40 -bottom-24 -z-10 h-72 w-72 bg-crema/15" />
        <Bean className="top-2 right-10 -z-10 hidden w-10 rotate-18 text-crema/70 md:block" />
        <Bean className="top-14 right-24 -z-10 hidden w-7 rotate-[-26deg] text-crema/50 md:block" />
        <Bean className="top-6 right-40 -z-10 hidden w-5 rotate-40 text-crema/40 md:block" />
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">
            From résumé to shortlist in one grind
          </h2>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal delay={0} className="h-full">
            <StepCard step="1" title="Drop in your résumé" image={spotResume}>
              One PDF, up to 10 MB. It stays private — we use it only to score your matches.
            </StepCard>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <StepCard step="2" title="Set up your grind" image={spotGrinding}>
              Tell us the role and location, pick up to five postings, and start grinding. We
              fetch real listings and pull out what each one actually requires.
            </StepCard>
          </Reveal>
          <Reveal delay={200} className="h-full">
            <StepCard step="3" title="Review matches, best fit first" image={spotScorecard}>
              Each role gets a 0–100 score, a fit tier, and a list of gaps worth a look before you
              apply. Shortlist the good ones and track them on your pipeline board.
            </StepCard>
          </Reveal>
        </div>
      </section>

      <Band className="bg-surface">
        {/* Mirror of the first band's garnish — stain bottom-left, spill
            top-right — so the two never read as a copy-paste. */}
        <BandDecor>
          <CoffeeRing className="-bottom-28 -left-20 w-96 -rotate-45 text-crema/60" />
          <Blob className="-top-24 -right-32 h-80 w-80 rotate-12 bg-bg/60" />
          <Bean className="top-12 right-[12%] hidden w-8 rotate-22 text-crema/70 lg:block" />
        </BandDecor>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              Everything brews from the scorecard
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal delay={0} className="h-full">
              <FeatureCard
                elevated
                stripe
                tone="warning"
                icon={<WarningIcon size={24} weight="fill" />}
                title="Gap callouts"
              >
                See what's missing before you hit apply — every gap named, none hand-waved.
              </FeatureCard>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <FeatureCard
                elevated
                stripe
                tone="danger"
                icon={<ShieldCheckIcon size={24} weight="fill" />}
                title="Dealbreaker checks"
              >
                If a posting has a hard requirement — location, authorization, seniority — it's
                cleared explicitly or flagged "Can't confirm," never silently skipped.
              </FeatureCard>
            </Reveal>
            <Reveal delay={0} className="h-full">
              <FeatureCard
                elevated
                stripe
                tone="accent"
                icon={<KanbanIcon size={24} weight="fill" />}
                title="Pipeline board"
              >
                A kanban for your hunt: Matched, Shortlisted, Applied, Interviewing, Offer. Drag
                cards along as you go.
              </FeatureCard>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <FeatureCard
                elevated
                stripe
                tone="crema"
                icon={<PenNibIcon size={24} weight="fill" />}
                title="Cover letter starters"
              >
                A tailored first draft built from your scorecard — edit freely before you send it.
              </FeatureCard>
            </Reveal>
          </div>
        </div>
      </Band>

      <Band dark className="border-y border-border bg-bg">
        {/* Hand-drawn doodles drift behind the espresso — the one texture
            moment on the page. Crema strokes at low opacity, per the tile's
            design; content paints above it. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          // Quoted url(): Vite inlines the tile as a data URI whose
          // percent-encoding keeps raw single quotes, which an unquoted
          // CSS url() rejects outright.
          style={{ backgroundImage: `url("${doodleTile}")`, backgroundSize: '600px' }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 sm:py-20">
          <Reveal>
            <Card className="flex flex-col gap-3">
              <h2 className="font-display text-2xl font-semibold">Free while in beta</h2>
              <p className="text-text-secondary">
                Every account gets 5 free runs a month, up to 5 postings per run. There's also a
                site-wide daily cap that keeps our AI bill from boiling over — if you hit it, come
                back tomorrow. No card, no ads, no selling your data.
              </p>
            </Card>
          </Reveal>
          <Reveal>
            <CoffeeDivider className="mx-auto w-full max-w-xl" />
          </Reveal>
          <Reveal>
            <section className="flex flex-col items-center gap-4 text-center">
              {/* Steam rises off the mug's opening — the cup sits in the left ~60%
                  of the mascot's box, so the wisps cluster left of center. */}
              <span aria-hidden className="relative">
                <BrandMark className="size-14" />
                <span className="absolute -top-2 left-1 h-3 w-0.5 rounded-full bg-text-secondary/60 motion-safe:animate-steam" />
                <span className="absolute -top-3 left-4 h-4 w-0.5 rounded-full bg-text-secondary/60 motion-safe:animate-steam [animation-delay:600ms]" />
                <span className="absolute -top-2 left-7 h-3 w-0.5 rounded-full bg-text-secondary/60 motion-safe:animate-steam [animation-delay:1200ms]" />
              </span>
              <h2 className="font-display text-3xl font-semibold">Ready to grind?</h2>
              <p className="max-w-xl text-text-secondary">
                Sign up with your email, drop in your résumé, and see your first scorecard in a
                couple of minutes.
              </p>
              <Button size="lg" onClick={() => signIn('signup')}>
                <CoffeeIcon size={18} weight="fill" />
                Start grinding — it's free
              </Button>
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                {/* accent-hover, not accent: the only cinnamon that passes AA at this size in both themes */}
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="font-semibold text-accent-hover hover:underline"
                >
                  Sign in
                </button>
              </p>
              <p className="text-xs text-text-secondary">
                By signing up you agree to the{' '}
                <Link to="/terms" className="underline hover:text-text">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="underline hover:text-text">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </Reveal>
        </div>
      </Band>

      <SiteFooter />
    </div>
  );
}

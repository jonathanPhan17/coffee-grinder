import { Link } from 'react-router';
import { BrandMark } from '@/components/ui/BrandMark';

/** Public-page footer — rendered by the landing and legal pages only, never AppShell. */
export function SiteFooter() {
  return (
    <footer
      // Rendered inside AppShell's <main>, where a bare <footer> loses its
      // landmark (role=generic per HTML-AAM) — restore it for screen readers.
      role="contentinfo"
      className="mt-4 flex flex-col gap-8 border-t border-border pt-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-9" />
            <span className="font-display font-semibold">Coffee Grinder</span>
          </div>
          <p className="text-sm text-text-secondary">Job matches, scored with receipts.</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link to="/terms" className="transition-colors hover:text-text">
            Terms
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-text">
            Privacy
          </Link>
        </div>
      </div>
      <p className="w-full text-xs text-text-secondary">
        © 2026 Coffee Grinder. Scores are AI-generated — double-check them before you rely on them.
      </p>
    </footer>
  );
}

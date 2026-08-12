import type { ReactNode } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="flex flex-col gap-2 text-text-secondary">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Your data"
        title="Privacy Policy"
        description="What we collect, where it lives, and what we'll never do with it. Last updated August 11, 2026."
      />

      <div className="flex max-w-3xl flex-col gap-8">
        <Section title="What we collect">
          <p>Only what the product needs to work:</p>
          <ul className="list-disc pl-5">
            <li>Your account email, via sign-in (AWS Cognito).</li>
            <li>The résumé PDF you upload.</li>
            <li>The structured profile our AI extracts from it — roles, skills, education.</li>
            <li>Your run settings (job title, location, how many postings to screen).</li>
            <li>The resulting scorecards, matches, and pipeline-board state.</li>
            <li>Basic operational logs (requests and errors) to keep the service running.</li>
          </ul>
        </Section>

        <Section title="Where it lives">
          <p>
            Everything is stored on Amazon Web Services in the US (Northern California): your
            résumé in a private S3 bucket, everything else in DynamoDB. Traffic is encrypted in
            transit, and the APIs only answer to your signed-in session.
          </p>
        </Section>

        <Section title="How AI is involved">
          <p>
            To build scorecards, your résumé and each posting are processed by AI models on AWS
            Bedrock. Per AWS's terms, Bedrock does not use your content to train models. Your
            résumé is used only to score your matches — the same promise the upload page makes.
          </p>
        </Section>

        <Section title="What we don't do">
          <p>
            No ads. No third-party analytics or tracking scripts. No selling or sharing your data.
            The only things kept in your browser are your sign-in session and your theme choice.
          </p>
        </Section>

        <Section title="Retention and deletion">
          <p>
            Re-uploading a résumé replaces the previous one. Runs and matches stick around so
            your history keeps working. There's no self-serve account deletion yet —
            it's on the list — but ask (contact below) and we'll delete your account and
            everything attached to it.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            Upload only what you're comfortable having scored. You can replace your résumé
            anytime, and you can ask for full deletion.
          </p>
        </Section>

        <Section title="Changes">
          <p>If this policy changes, the "last updated" date above changes with it.</p>
        </Section>

        <Section title="Contact">
          <p>
            Coffee Grinder is a small, independently run beta and doesn't have a public contact
            address yet — one is coming. Until then, the fastest route for questions or deletion
            requests is the person who shared the site with you.
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}

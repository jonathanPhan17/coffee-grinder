import { useNavigate } from 'react-router';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Dropzone } from '@/features/resume/Dropzone';
import { ProfileSummary } from '@/features/resume/ProfileSummary';
import { ResumeFileCard } from '@/features/resume/ResumeFileCard';
import { UploadStepper } from '@/features/resume/UploadStepper';
import { useResume } from '@/features/resume/useResume';
import { useResumeUpload } from '@/features/resume/useResumeUpload';

export function UploadPage() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useResume();
  const { status, error, upload } = useResumeUpload();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={profile ? 'Résumé ready' : 'Welcome back, Alex'}
        title={
          profile
            ? 'Nicely brewed — we read your résumé.'
            : 'Find the roles actually worth your time.'
        }
        description={
          profile
            ? 'Here is what we pulled from your résumé. Continue when you are ready to set up your grind.'
            : 'Drop in your résumé and Coffee Grinder reads every posting for you — scoring how well each one fits, so you spend energy only on the matches that matter.'
        }
      />

      {profile ? (
        <div className="flex flex-col gap-6">
          <ResumeFileCard profile={profile} onReupload={clearProfile} />
          <ProfileSummary profile={profile} />
          <div className="flex justify-end">
            <Button size="lg" onClick={() => navigate('/runs/new')}>
              Continue to grind setup
              <ArrowRightIcon size={18} weight="bold" />
            </Button>
          </div>
        </div>
      ) : (
        <Dropzone onFile={upload} isParsing={status === 'parsing'} error={error} />
      )}

      <UploadStepper current={1} />
    </div>
  );
}

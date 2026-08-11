import { createContext } from 'react';
import type { ResumeProfile } from '@/types/domain';

export interface ResumeContextValue {
  profile: ResumeProfile | null;
  setProfile: (profile: ResumeProfile | null) => void;
  clearProfile: () => void;
  /** True while the stored profile is being fetched — gates wait instead of redirecting. */
  isHydrating: boolean;
}

export const ResumeContext = createContext<ResumeContextValue | null>(null);

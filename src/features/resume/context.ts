import { createContext } from 'react';
import type { ResumeProfile } from '@/types/domain';

export interface ResumeContextValue {
  profile: ResumeProfile | null;
  setProfile: (profile: ResumeProfile | null) => void;
  clearProfile: () => void;
}

export const ResumeContext = createContext<ResumeContextValue | null>(null);

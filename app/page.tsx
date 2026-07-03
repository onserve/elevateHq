import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import type { Metadata } from 'next';

import { LandingNav } from '@/components/landing/landing-nav';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingWorksWith } from '@/components/landing/landing-works-with';
import { LandingAiDemo } from '@/components/landing/landing-ai-demo';
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works';
import { LandingSocialProof } from '@/components/landing/landing-social-proof';
import { LandingPersonas } from '@/components/landing/landing-personas';
import { LandingProjects } from '@/components/landing/landing-projects';
import { LandingGoalsTasks } from '@/components/landing/landing-goals-tasks';
import { LandingFooter } from '@/components/landing/landing-footer';

export const metadata: Metadata = {
  title: 'ElevateHQ — Stop reading bank statements. Start asking questions.',
  description:
    'Upload a PDF or connect Gmail — ElevateHQ extracts every transaction automatically and lets your AI answer questions about your money. Built for East Africa.',
};

export default async function HomePage() {
  const session = await auth();
  if (session && !session.error) redirect('/dashboard');

  return (
    /**
     * Force light-mode palette with hardcoded Tailwind colour classes
     * (not CSS-variable tokens) so the landing page always renders in
     * light mode regardless of the user's system / ThemeProvider setting.
     */
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingWorksWith />
      <LandingAiDemo />
      <LandingHowItWorks />
      <LandingSocialProof />
      <LandingPersonas />
      <LandingProjects />
      <LandingGoalsTasks />
      <LandingFooter />
    </div>
  );
}

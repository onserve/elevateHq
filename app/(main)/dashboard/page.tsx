import { auth } from '@/lib/auth/auth';
import { DashboardWelcomeHeader } from '@/components/dashboard/dashboard-welcome-header';
import { DashboardKpiBar } from '@/components/dashboard/dashboard-kpi-bar';
import { AiInsightBanner } from '@/components/dashboard/ai-insight-banner';
import { DashboardProjectsFeed } from '@/components/dashboard/dashboard-projects-feed';
import { DashboardDocumentsFeed } from '@/components/dashboard/dashboard-documents-feed';
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions';

// Mock AI insight — swap message + href for real endpoint data when ready
const AI_INSIGHT = {
  message:
    'AI Insight: Your most active project is approaching its budget threshold — review spending before the next milestone.',
  href: '/projects',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null; // Layout handles redirect; this narrows the type

  return (
    <div className="min-h-full p-6 md:p-8 max-w-screen-xl mx-auto space-y-6">
      {/* Greeting + header action buttons */}
      <DashboardWelcomeHeader userName={session.user.name ?? 'there'} />

      {/* KPI bar — Active Projects · Documents · Monthly Revenue */}
      <DashboardKpiBar />

      {/* AI insight strip
      <AiInsightBanner message={AI_INSIGHT.message} href={AI_INSIGHT.href} reviewLabel="Review" /> */}

      {/* Two-panel content grid — Projects (left) + Documents (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardProjectsFeed />
        <DashboardDocumentsFeed />
      </div>

      {/* Quick-access action strip */}
      <DashboardQuickActions />
    </div>
  );
}

'use client';

import { Project } from '@/lib/api/service/project-service';
import { ProjectOverviewTab } from './tabs/project-overview-tab';
import { ProjectTasksTab } from './tabs/project-tasks-tab';
import { ProjectFinanceTab } from './tabs/project-finance-tab';
import { ProjectGoalsTab } from './tabs/project-goals-tab';

interface ProjectDetailTabsProps {
  activeTab: 'overview' | 'tasks' | 'finance' | 'goals';
  onTabChange: (tab: 'overview' | 'tasks' | 'finance' | 'goals') => void;
  project: Project;
}

export function ProjectDetailTabs({
  activeTab,
  onTabChange,
  project,
}: ProjectDetailTabsProps) {
  const tabs: Array<{
    id: 'overview' | 'tasks' | 'finance' | 'goals';
    label: string;
  }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'finance', label: 'Finance' },
    { id: 'goals', label: 'Goals' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 lg:gap-8 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 font-medium text-xs lg:text-sm whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <ProjectOverviewTab project={project} />}
        {activeTab === 'tasks' && <ProjectTasksTab projectId={project.id.toString()} />}
        {activeTab === 'finance' && <ProjectFinanceTab project={project} />}
        {activeTab === 'goals' && <ProjectGoalsTab projectId={project.id.toString()} />}
      </div>
    </div>
  );
}

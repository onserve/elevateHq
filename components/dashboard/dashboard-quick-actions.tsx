'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Upload, TrendingUp, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from '@/components/project/project-form';

interface Action {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

function ActionTile({ action }: { action: Action }) {
  const Icon = action.icon;
  return (
    <button
      key={action.id}
      onClick={action.onClick}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-accent/5 hover:shadow-sm transition-all duration-200 text-left w-full"
    >
      <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{action.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
      </div>
    </button>
  );
}

export function DashboardQuickActions() {
  const router = useRouter();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const actions: Action[] = [
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Start tracking',
      icon: Plus,
      onClick: () => setProjectDialogOpen(true),
    },
    {
      id: 'upload-doc',
      label: 'Upload Doc',
      description: 'Extract transactions',
      icon: Upload,
      onClick: () => router.push('/documents'),
    },
    {
      id: 'view-finance',
      label: 'View Finance',
      description: 'Check cashflow',
      icon: TrendingUp,
      onClick: () => router.push('/finance'),
    },
    {
      id: 'set-goal',
      label: 'Set a Goal',
      description: 'Track progress',
      icon: Target,
      onClick: () => router.push('/goals'),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <ActionTile key={action.id} action={action} />
        ))}
      </div>

      {/* New Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initial={null}
            onSuccess={() => setProjectDialogOpen(false)}
            onCancel={() => setProjectDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

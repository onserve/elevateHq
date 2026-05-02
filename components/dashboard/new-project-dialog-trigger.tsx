'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from '@/components/project/project-form';
import { cn } from '@/lib/utils';

interface NewProjectDialogTriggerProps {
  /** Content rendered inside the trigger button */
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

/**
 * Self-contained "New Project" trigger.
 * Manages its own dialog open/close state.
 * Used in both DashboardWelcomeHeader and DashboardQuickActions.
 */
export function NewProjectDialogTrigger({
  children,
  variant = 'default',
  size = 'default',
  className,
}: NewProjectDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        {children ?? (
          <>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initial={null}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

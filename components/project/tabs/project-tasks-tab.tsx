'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ProjectTasksTabProps {
  projectId: string;
}

export function ProjectTasksTab({ projectId }: ProjectTasksTabProps) {
  // Placeholder for tasks
  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Project Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Tasks for this project will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

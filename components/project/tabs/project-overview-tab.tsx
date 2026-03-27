'use client';

import { Project } from '@/lib/api/service/project-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectOverviewTabProps {
  project: Project;
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {project.description && (
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

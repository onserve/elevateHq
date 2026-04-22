import { getProjectDetails } from '@/lib/api/service/project-service';
import { ProjectDetail } from '@/components/project/project-detail';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/server-api-client';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const project = await getProjectDetails(id);
    return <ProjectDetail project={project} projectId={id} />;
  } catch (error) {
    // Only treat a genuine 404 as not-found.
    // Any other error (500, network) re-throws and is caught by error.tsx.
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

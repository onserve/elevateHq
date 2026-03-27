import { getProjectDetails } from '@/lib/api/service/project-service';
import { ProjectDetail } from '@/components/project/project-detail';
import { notFound } from 'next/navigation';

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
    notFound();
  }
}

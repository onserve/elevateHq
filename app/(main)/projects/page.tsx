import { getProjectsList } from '@/lib/api/service/project-service';
import { ProjectList } from '@/components/project/project-list';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    status?: string;
    priority?: string;
    name?: string;
  }>;
}) {
  // 1. Unwrap the searchParams Promise (Next.js 15 requirement)
  const params = await searchParams;

  // 2. Parse query parameters from the URL
  // Defaulting to page 0 and size 10 if not provided
  const page = params.page ? parseInt(params.page) : 0;
  const size = params.size ? parseInt(params.size) : 10;

  // 3. Fetch initial data on the server (Secure & Fast)
  // The service layer uses the ServerApiClient which handles tokens on the server [3, 5]
  const initialData = await getProjectsList({
    page,
    size,
    sort: params.sort || 'createdAt,desc',
    status: params.status,
    priority: params.priority,
    name: params.name,
  });

  return (
    <div className="min-h-full p-8">
      {/* Page Header with improved spacing and hierarchy */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
        <p className="text-base text-muted-foreground">
          Manage and track all your projects and their associated goals
        </p>
      </div>

      {/* Handoff the initial data to the interactive Client Component */}
      <ProjectList initialData={initialData} />
    </div>
  );
}

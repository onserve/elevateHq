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
      {/* Page Header following established design patterns [6, 7] */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track all your projects and their associated goals
        </p>
      </div>

      {/* 
          Handoff the initial data to the interactive Client Component.
          This ensures immediate rendering of content for the user [4, 8].
      */}
      <ProjectList initialData={initialData} />
    </div>
  );
}

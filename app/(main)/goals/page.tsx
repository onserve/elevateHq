import { getGoals } from '@/lib/api/service/goal-service';
import { GoalList } from '@/components/goal/goal-list';

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    status?: string;
    category?: string;
    title?: string;
  }>;
}) {
  // 1. Unwrap the searchParams Promise (Next.js 15 requirement)
  const params = await searchParams;

  // 2. Parse query parameters for the backend request
  const page = params.page ? parseInt(params.page) : 0;
  const size = params.size ? parseInt(params.size) : 10;

  // 3. Fetch initial data on the server (Secure & Fast)
  // This uses the Server Action layer which handles the Bearer token internally [4, 6]
  const initialData = await getGoals({
    page,
    size,
    sort: params.sort || 'createdAt,desc',
    status: params.status,
    category: params.category,
    title: params.title,
  });

  return (
    <div className="min-h-full p-8">
      {/* Page Header with improved spacing and hierarchy */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Goals</h1>
        <p className="text-base text-muted-foreground">
          Track progress toward your project objectives and key milestones
        </p>
      </div>

      {/* Hand off the initial data to the interactive Client Component */}
      <GoalList initialData={initialData} />
    </div>
  );
}

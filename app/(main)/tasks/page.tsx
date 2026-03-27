import { getTasks } from '@/lib/api/service/task-service';
import { TaskList } from '@/components/task/task-list';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; sort?: string; status?: string; priority?: string };
}) {
  const params = await searchParams;
  // 1. Parse query parameters from the URL
  const page = params.page ? parseInt(params.page) : 0;
  const size = params.size ? parseInt(params.size) : 10;

  // 2. Fetch initial data on the server (Secure & Fast) [5, 6]
  // This uses your service layer which hides tokens from the browser [7, 8]
  const initialData = await getTasks({
    page,
    size,
    sort: params.sort || 'createdAt,desc',
    status: params.status,
    priority: params.priority,
  });

  return (
    <div className="min-h-full p-4">
      {/* Page Header from your Design [9] */}
      {/* Hand off the initial data to the interactive Client Component [10, 11] */}
      <TaskList initialData={initialData} />
    </div>
  );
}

import { auth } from '@/lib/auth/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Your current authentication details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Email:</span> {session.user.email}
          </div>
          <div>
            <span className="font-semibold">Name:</span> {session.user.name}
          </div>
          <div>
            <span className="font-semibold">ID:</span> {(session.user as any).id}
          </div>
          <div>
            <span className="font-semibold">Roles:</span>{' '}
            {(session.user as any).roles?.join(', ') || 'None'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { auth } from '@/lib/auth/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-full p-8">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-base text-muted-foreground">
          Welcome back, {session.user.name}. Here&apos;s an overview of your activity.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Active Projects */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-foreground">8</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">3 completing soon</p>
          </CardContent>
        </Card>

        {/* Completed Goals */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Goals</p>
                <p className="text-3xl font-bold text-foreground">12</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">This month</p>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">47</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">24 pending</p>
          </CardContent>
        </Card>

        {/* At Risk */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">At Risk</p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* User Details Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-xl">Account Information</CardTitle>
          <CardDescription>Your authentication details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email Address</p>
              <p className="text-base font-medium text-foreground">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-base font-medium text-foreground">{session.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="text-base font-medium font-mono text-foreground text-sm">
                {(session.user as any).id}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Roles</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {(session.user as any).roles?.length > 0 ? (
                  (session.user as any).roles.map((role: string) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// components/dashboard/header.tsx
import { Session } from 'next-auth';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationBell } from './notification-bell';

interface DashboardHeaderProps {
  session: Session;
}

/**
 * DashboardHeader - Server Component with Client islands
 *
 * Structure:
 * - Server Component wrapper (this file)
 * - Static search input (could be made interactive later)
 * - Client Component islands (ThemeToggle, NotificationBell)
 *
 * Why Server Component?
 * - Can fetch notifications data here if needed
 * - Renders static parts as HTML
 * - Only interactive parts hydrate on client
 *
 * Future enhancement:
 * - Fetch notifications: const notifications = await getNotifications(session.user.id)
 * - Pass as initialData to NotificationBell
 * - NotificationBell can then use React Query for refetching
 */
export async function DashboardHeader({ session }: DashboardHeaderProps) {
  // Future: Server-side data fetching
  // const notifications = await getNotifications(session.user.id)

  return (
    <>
      {/* Mobile Header - visible on small screens */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">Life Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
        </div>
      </div>

      {/* Desktop Header - visible on large screens */}
      <header className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-background">
        {/* Left side - Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle - Client Component */}
          <ThemeToggle />

          {/* Notifications - Client Component */}
          <NotificationBell />
        </div>
      </header>
    </>
  );
}

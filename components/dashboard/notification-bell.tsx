// components/dashboard/notification-bell.tsx
'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

/**
 * NotificationBell - Client Component for notifications
 *
 * Current implementation: Placeholder
 *
 * Future enhancements:
 * 1. Receive initialData as prop from Server Component parent
 * 2. Use React Query for real-time updates
 * 3. WebSocket integration for live notifications
 *
 * Example with React Query:
 *
 * interface NotificationBellProps {
 *   initialData: Notification[]
 * }
 *
 * export function NotificationBell({ initialData }: NotificationBellProps) {
 *   const { data: notifications } = useQuery({
 *     queryKey: ['notifications'],
 *     queryFn: fetchNotifications,
 *     initialData,  // Use server-fetched data as starting point
 *     refetchInterval: 30000, // Refetch every 30 seconds
 *   })
 *
 *   // Rest of component...
 * }
 */
export function NotificationBell() {
  // TODO: Replace with real data
  const notifications: any[] = [];
  const unreadCount = 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {/* Show badge if there are unread notifications */}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}

          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No notifications yet</p>
          ) : (
            <div className="space-y-2">{/* Future: Map through notifications here */}</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

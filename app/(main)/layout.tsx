// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout - Server Component
 *
 * This is the layout for all /dashboard/* routes due to the route group structure:
 * app/(dashboard)/layout.tsx applies to all routes inside (dashboard)/
 *
 * Execution flow:
 * 1. User navigates to /dashboard/projects
 * 2. Middleware runs first (auth check at edge)
 * 3. This layout component runs (server-side)
 * 4. await auth() gets session from server
 * 5. If no session, redirect (backup to middleware)
 * 6. Render layout with session data
 * 7. Page component renders inside {children}
 * 8. HTML sent to browser
 * 9. Client components hydrate (nav, dropdowns, etc.)
 *
 * Why Server Component?
 * - No loading states (session available immediately)
 * - Can fetch data here (notifications, preferences, etc.)
 * - Static parts render as HTML (faster)
 * - Only interactive parts become client components
 *
 * Performance benefits:
 * - No useEffect(() => { checkAuth() }, [])
 * - No loading spinner on every page
 * - Smaller JavaScript bundle
 * - Better SEO (fully rendered HTML)
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // ═══════════════════════════════════════════════════════
  // STEP 1: Server-side authentication check
  // ═══════════════════════════════════════════════════════
  // This runs on the server for every request
  // No client-side loading state needed!
  const session = await auth();

  // ═══════════════════════════════════════════════════════
  // STEP 2: Redirect if not authenticated
  // ═══════════════════════════════════════════════════════
  // This is a backup to middleware
  // Middleware should catch this first, but defense in depth
  if (!session) {
    redirect('/');
  }

  // ═══════════════════════════════════════════════════════
  // STEP 3: Optional - Fetch initial data
  // ═══════════════════════════════════════════════════════
  // You can fetch data here and pass it down as props
  // This data will be available immediately (no loading state)

  // Example:
  // const notifications = await getNotifications(session.user.id)
  // const userPreferences = await getUserPreferences(session.user.id)

  // Then pass to components:
  // <DashboardHeader session={session} notifications={notifications} />

  // ═══════════════════════════════════════════════════════
  // STEP 4: Render the layout
  // ═══════════════════════════════════════════════════════
  return (
    <DashboardShell>
      {/* 
        Desktop Sidebar
        - Hidden on mobile (hidden lg:flex)
        - Fixed position sidebar
        - Contains navigation and user menu
        - Server Component with Client islands
      */}
      <DashboardSidebar session={session} />

      {/* 
        Main Content Area
        - Takes remaining space (flex-1)
        - Contains header and page content
      */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 
          Header
          - Shows on both mobile and desktop (different layouts)
          - Contains search, theme toggle, notifications
          - Server Component with Client islands
        */}
        <DashboardHeader session={session} />

        {/* 
          Page Content
          - This is where the page component renders
          - Each page is also a Server Component by default
          - Can have its own loading.tsx and error.tsx
        */}
        <main className="flex-1">{children}</main>
      </div>

      {/* 
        Mobile Navigation
        - Only visible on mobile (bottom nav bar)
        - Client Component for interactivity
      */}
      <MobileNav />
    </DashboardShell>
  );
}

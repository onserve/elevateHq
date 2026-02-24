// components/dashboard/sidebar.tsx
import { Session } from 'next-auth';
import { Shield } from 'lucide-react';
import { SidebarNav } from './sidebar-nav';
import { UserMenu } from './user-menu';

interface DashboardSidebarProps {
  session: Session;
}

/**
 * DashboardSidebar - Hybrid pattern (Server wrapper + Client islands)
 *
 * This is a Server Component that:
 * 1. Renders static parts (logo) as HTML
 * 2. Embeds Client Components (nav, user menu) as islands
 * 3. Passes session data as props (not context)
 *
 * Flow:
 * Layout (Server) → gets session → passes to Sidebar → passes to children
 *
 * Why this pattern?
 * - Server renders the structure (no JS)
 * - Only interactive parts become client components
 * - Best performance + interactivity
 */
export function DashboardSidebar({ session }: DashboardSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar">
      {/* 
        SECTION 1: Logo (Server Component)
        - Pure HTML, no interactivity
        - No JavaScript sent to client for this part
      */}
      <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
        <div className="p-2 bg-sidebar-accent rounded-lg">
          <Shield className="h-6 w-6 text-sidebar-accent-foreground" />
        </div>
        <span className="text-xl font-bold text-sidebar-foreground">Life Admin</span>
      </div>

      {/* 
        SECTION 2: Navigation (Client Component Island)
        - Needs usePathname() to highlight active link
        - This boundary means: "hydrate this part on client"
      */}
      <SidebarNav />

      {/* 
        SECTION 3: User Menu (Client Component Island)
        - Needs onClick handlers and dropdown state
        - Receives session data as props (not from context)
      */}
      <UserMenu
        name={session.user.name || 'User'}
        email={session.user.email || ''}
        image={session.user.image}
      />
    </aside>
  );
}

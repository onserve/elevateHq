// components/dashboard/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  Wallet,
  CheckSquare,
  FileText,
  User,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navigation items configuration
 *
 * This could be moved to a config file if you want to
 * manage permissions, hide/show based on roles, etc.
 */
const navigation = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: Briefcase,
    href: '/projects',
  },
  {
    id: 'goals',
    name: 'Goals',
    icon: Target,
    href: '/goals',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: Wallet,
    href: '/finance',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    href: '/documents',
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: User,
    href: '/profile',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

/**
 * SidebarNav - Client Component for interactive navigation
 *
 * Why is this a Client Component?
 * - Uses usePathname() hook (only available in Client Components)
 * - Needs to know current route to highlight active link
 *
 * How it works:
 * 1. usePathname() returns current path (e.g., "/dashboard/projects")
 * 2. Compare with each nav item's href
 * 3. Apply active styles to matching item
 * 4. On click, Next.js does client-side navigation (fast!)
 *
 * Performance notes:
 * - Only this component hydrates (not the parent sidebar)
 * - Navigation is static data (no API calls)
 * - Client-side routing = instant navigation
 */
export function SidebarNav() {
  // Get current pathname - this hook requires "use client"
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;

        // Check if this nav item is currently active
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              // Base styles - always applied
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',

              // Conditional styles based on active state
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

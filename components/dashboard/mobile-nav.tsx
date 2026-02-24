// components/dashboard/mobile-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, User, Settings, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mobile navigation items
 * Only show the most important 5 items on mobile
 */
const mobileNav = [
  {
    id: 'dashboard',
    name: 'Home',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: Briefcase,
    href: 'projects',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: CheckSquare,
    href: 'tasks',
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
 * MobileNav - Bottom navigation bar for mobile devices
 *
 * Why Client Component?
 * - Uses usePathname() to highlight active link
 * - Only visible on mobile (< lg breakpoint)
 *
 * Design decisions:
 * - Limit to 5 items (mobile screen space is limited)
 * - Fixed at bottom of screen
 * - Always visible (doesn't collapse)
 * - High z-index to stay on top of content
 *
 * Responsive behavior:
 * - Mobile: Visible at bottom
 * - Desktop (lg+): Hidden (desktop sidebar is shown instead)
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="lg:hidden h-16" />
    </>
  );
}

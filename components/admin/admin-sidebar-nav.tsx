'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Zap,
  Users,
  Server,
  FileClock,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Token Usage', href: '/admin/tokens', icon: Zap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Providers', href: '/admin/providers', icon: Server },
  { name: 'Logs', href: '/admin/logs', icon: FileClock },
  { name: 'Rate Limits', href: '/admin/rate-limits', icon: Gauge },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
      {navigation.map((item) => {
        const Icon = item.icon;
        // Exact match for /admin, startsWith for others to keep active state on sub-pages
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
              isActive
                ? 'bg-[#064E3B]/80 text-emerald-400 border border-[#047857]/40 shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200 border border-transparent'
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-slate-500")} strokeWidth={isActive ? 2 : 1.5} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

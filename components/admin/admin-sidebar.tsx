import { Session } from 'next-auth';
import { Shield, HelpCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminSidebarNav } from './admin-sidebar-nav';

export function AdminSidebar({ session }: { session: Session }) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-[#1E293B] bg-[#0F172A] shadow-xl">
      {/* Header Area */}
      <div className="flex items-center gap-3 p-6 pt-8">
        <div className="p-2 bg-[#064E3B] rounded-lg border border-[#047857]/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Shield className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-200 leading-tight">Admin Console</h2>
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">AI Infrastructure</p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#064E3B]/40 text-emerald-400 rounded-lg text-xs font-medium border border-emerald-900/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Main Navigation */}
      <AdminSidebarNav />

      {/* Footer Area */}
      <div className="mt-auto p-4 flex items-center justify-between border-t border-[#1E293B] bg-[#0B1120]/50">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors py-2 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to App
        </Link>
        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

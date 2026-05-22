import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">Users</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          10 total users · 7 active
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A]/50 p-5 flex flex-col justify-between h-[110px]">
          <p className="text-[13px] text-slate-400">Total Users</p>
          <div className="text-3xl font-bold text-slate-100">10</div>
        </div>
        
        {/* Active */}
        <div className="rounded-xl border border-emerald-900/30 bg-[#022C22]/30 p-5 flex flex-col justify-between h-[110px]">
          <p className="text-[13px] text-slate-400">Active (30d)</p>
          <div className="text-3xl font-bold text-emerald-400">7</div>
        </div>

        {/* Pro Plan */}
        <div className="rounded-xl border border-blue-900/30 bg-[#0A192F]/50 p-5 flex flex-col justify-between h-[110px]">
          <p className="text-[13px] text-slate-400">Pro Plan</p>
          <div className="text-3xl font-bold text-blue-400">6</div>
        </div>

        {/* Suspended */}
        <div className="rounded-xl border border-rose-900/30 bg-[#2A0E17]/30 p-5 flex flex-col justify-between h-[110px]">
          <p className="text-[13px] text-slate-400">Suspended</p>
          <div className="text-3xl font-bold text-rose-500">1</div>
        </div>
      </div>

      {/* Users Table Area */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="flex items-center p-1 bg-[#0F172A] rounded-lg border border-[#1E293B]">
              <button className="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[12px] font-medium">All</button>
              <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-[12px] font-medium transition-colors">Active</button>
              <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-[12px] font-medium transition-colors">Inactive</button>
              <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-[12px] font-medium transition-colors">Suspended</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] overflow-hidden">
          <div className="grid grid-cols-12 text-[11px] font-medium text-slate-500 px-6 py-4 border-b border-[#1E293B] bg-[#0B1120]/50">
            <div className="col-span-3">User</div>
            <div className="col-span-1">Plan</div>
            <div className="col-span-1 text-right pr-4">Tokens Used</div>
            <div className="col-span-2">Quota</div>
            <div className="col-span-1 text-right">Cost ⌄</div>
            <div className="col-span-1 text-right">Requests ⌄</div>
            <div className="col-span-2 text-right">Last Active</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          
          <div className="divide-y divide-[#1E293B]/50">
            {/* Sarah */}
            <div className="grid grid-cols-12 items-center px-6 py-4 text-[13px] hover:bg-[#1E293B]/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#064E3B] text-emerald-400 flex items-center justify-center text-[11px] font-bold border border-emerald-900">
                  SK
                </div>
                <div>
                  <div className="font-medium text-slate-200">Sarah K.</div>
                  <div className="text-[11px] text-slate-500">sarah@ventures.io</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-bold text-emerald-500">Pro</span>
              </div>
              <div className="col-span-1 text-right pr-4 font-medium text-emerald-400">823K</div>
              <div className="col-span-2 flex items-center gap-3 pr-6">
                <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '82%' }} />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">82%</span>
              </div>
              <div className="col-span-1 text-right font-medium text-amber-400">$8.23</div>
              <div className="col-span-1 text-right text-slate-300">312</div>
              <div className="col-span-2 text-right text-slate-500">2 min ago</div>
              <div className="col-span-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  active
                </span>
              </div>
            </div>

            {/* Alex */}
            <div className="grid grid-cols-12 items-center px-6 py-4 text-[13px] hover:bg-[#1E293B]/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-[11px] font-bold border border-blue-900/50">
                  AM
                </div>
                <div>
                  <div className="font-medium text-slate-200">Alex M.</div>
                  <div className="text-[11px] text-slate-500">alex@agency.co</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-bold text-emerald-500">Pro</span>
              </div>
              <div className="col-span-1 text-right pr-4 font-medium text-emerald-400">654K</div>
              <div className="col-span-2 flex items-center gap-3 pr-6">
                <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">65%</span>
              </div>
              <div className="col-span-1 text-right font-medium text-amber-400">$6.54</div>
              <div className="col-span-1 text-right text-slate-300">245</div>
              <div className="col-span-2 text-right text-slate-500">18 min ago</div>
              <div className="col-span-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  active
                </span>
              </div>
            </div>

            {/* Raj */}
            <div className="grid grid-cols-12 items-center px-6 py-4 text-[13px] hover:bg-[#1E293B]/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-bold border border-slate-700">
                  RP
                </div>
                <div>
                  <div className="font-medium text-slate-200">Raj P.</div>
                  <div className="text-[11px] text-slate-500">raj@company.io</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-bold text-slate-500">Free</span>
              </div>
              <div className="col-span-1 text-right pr-4 font-medium text-emerald-400">522K</div>
              <div className="col-span-2 flex items-center gap-3 pr-6">
                <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '87%' }} />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">87%</span>
              </div>
              <div className="col-span-1 text-right font-medium text-amber-400">$5.22</div>
              <div className="col-span-1 text-right text-slate-300">189</div>
              <div className="col-span-2 text-right text-slate-500">1 hr ago</div>
              <div className="col-span-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  active
                </span>
              </div>
            </div>

            {/* Mei */}
            <div className="grid grid-cols-12 items-center px-6 py-4 text-[13px] hover:bg-[#1E293B]/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-[11px] font-bold border border-emerald-900">
                  ML
                </div>
                <div>
                  <div className="font-medium text-slate-200">Mei L.</div>
                  <div className="text-[11px] text-slate-500">mei@studio.dev</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-bold text-emerald-500">Pro</span>
              </div>
              <div className="col-span-1 text-right pr-4 font-medium text-emerald-400">398K</div>
              <div className="col-span-2 flex items-center gap-3 pr-6">
                <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">40%</span>
              </div>
              <div className="col-span-1 text-right font-medium text-amber-400">$3.98</div>
              <div className="col-span-1 text-right text-slate-300">156</div>
              <div className="col-span-2 text-right text-slate-500">3 hr ago</div>
              <div className="col-span-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  active
                </span>
              </div>
            </div>

            {/* James */}
            <div className="grid grid-cols-12 items-center px-6 py-4 text-[13px] hover:bg-[#1E293B]/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center text-[11px] font-bold border border-purple-900/50">
                  JT
                </div>
                <div>
                  <div className="font-medium text-slate-200">James T.</div>
                  <div className="text-[11px] text-slate-500">james@corp.net</div>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-bold text-slate-500">Free</span>
              </div>
              <div className="col-span-1 text-right pr-4 font-medium text-emerald-400">287K</div>
              <div className="col-span-2 flex items-center gap-3 pr-6">
                <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '48%' }} />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">48%</span>
              </div>
              <div className="col-span-1 text-right font-medium text-amber-400">$2.87</div>
              <div className="col-span-1 text-right text-slate-300">98</div>
              <div className="col-span-2 text-right text-slate-500">5 hr ago</div>
              <div className="col-span-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

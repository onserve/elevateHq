import { 
  FileText, 
  Hourglass, 
  FolderOpen, 
  Receipt, 
  Clock, 
  Zap,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">Platform Overview</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Friday, May 15, 2026 · Real-time view across all users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 border-[#1E293B] bg-[#0F172A] text-slate-300 hover:bg-[#1E293B] hover:text-slate-100">
            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-900/50 bg-[#064E3B]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-6 gap-4">
        {/* Docs Processed */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A]/50 p-5 flex flex-col justify-between h-[120px]">
          <FileText className="h-4 w-4 text-emerald-500" />
          <div>
            <div className="text-2xl font-bold text-emerald-500">342</div>
            <p className="text-[11px] text-slate-400">Docs Processed</p>
            <p className="text-[10px] text-slate-500 mt-0.5">+28 this week</p>
          </div>
        </div>
        
        {/* In Queue */}
        <div className="rounded-xl border border-amber-900/30 bg-[#1A1608] p-5 flex flex-col justify-between h-[120px] relative overflow-hidden">
          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-amber-400" />
          <Hourglass className="h-4 w-4 text-amber-500" />
          <div>
            <div className="text-2xl font-bold text-amber-500">3</div>
            <p className="text-[11px] text-slate-400">In Queue</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Processing now</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-blue-900/30 bg-[#0A192F] p-5 flex flex-col justify-between h-[120px]">
          <FolderOpen className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-2xl font-bold text-blue-400">47</div>
            <p className="text-[11px] text-slate-400">Active Projects</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Across 142 users</p>
          </div>
        </div>

        {/* Transactions Extracted */}
        <div className="rounded-xl border border-purple-900/30 bg-[#171124] p-5 flex flex-col justify-between h-[120px]">
          <Receipt className="h-4 w-4 text-purple-400" />
          <div>
            <div className="text-2xl font-bold text-purple-400">2,841</div>
            <p className="text-[11px] text-slate-400">Transactions Extracted</p>
            <p className="text-[10px] text-slate-500 mt-0.5">+183 this week</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="rounded-xl border border-orange-900/30 bg-[#1F140D] p-5 flex flex-col justify-between h-[120px]">
          <Clock className="h-4 w-4 text-orange-400" />
          <div>
            <div className="text-2xl font-bold text-orange-400">18</div>
            <p className="text-[11px] text-slate-400">Pending Review</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Awaiting user action</p>
          </div>
        </div>

        {/* AI Tokens */}
        <div className="rounded-xl border border-[#064E3B]/40 bg-[#022C22] p-5 flex flex-col justify-between h-[120px]">
          <Zap className="h-4 w-4 text-teal-400" />
          <div>
            <div className="text-2xl font-bold text-teal-400">4.45M</div>
            <p className="text-[11px] text-slate-400">AI Tokens (May)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">$44.50 spend</p>
          </div>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] overflow-hidden">
        
        {/* Pipeline Visual Header */}
        <div className="p-6 border-b border-[#1E293B]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-slate-200">Document Processing Pipeline</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#1E293B] text-[10px] text-slate-400">All time</span>
            </div>
            <button className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1">
              Full view <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Uploaded */}
            <div className="flex-1 rounded-lg bg-[#1E293B]/40 border border-[#1E293B] p-4 text-center">
              <div className="text-xl font-bold text-slate-300">342</div>
              <div className="text-[11px] text-slate-500">Uploaded</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-700 shrink-0" />
            
            {/* Parsed */}
            <div className="flex-1 rounded-lg bg-blue-900/10 border border-blue-900/30 p-4 text-center relative">
              <div className="text-xl font-bold text-blue-400">336</div>
              <div className="text-[11px] text-slate-500">Parsed</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-rose-500">-1.8%</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-700 shrink-0" />

            {/* Extracted */}
            <div className="flex-1 rounded-lg bg-purple-900/10 border border-purple-900/30 p-4 text-center relative">
              <div className="text-xl font-bold text-purple-400">321</div>
              <div className="text-[11px] text-slate-500">Extracted</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-rose-500">-4.5%</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-700 shrink-0" />

            {/* Reviewed */}
            <div className="flex-1 rounded-lg bg-orange-900/10 border border-orange-900/30 p-4 text-center relative">
              <div className="text-xl font-bold text-orange-400">298</div>
              <div className="text-[11px] text-slate-500">Reviewed</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-rose-500">-7.2%</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-700 shrink-0" />

            {/* Imported */}
            <div className="flex-1 rounded-lg bg-emerald-900/10 border border-emerald-900/30 p-4 text-center relative">
              <div className="text-xl font-bold text-emerald-400">274</div>
              <div className="text-[11px] text-slate-500">Imported</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-rose-500">-8.1%</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          <div className="grid grid-cols-8 text-[11px] font-medium text-slate-500 px-6 pb-3">
            <div className="col-span-1">User</div>
            <div className="col-span-2">Document</div>
            <div className="col-span-1 text-center">Pages</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Transactions</div>
            <div className="col-span-1 text-center">Confidence</div>
            <div className="col-span-1 text-right">Tokens</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          
          <div className="divide-y divide-[#1E293B]/50">
            {/* Row 1 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">sarah</div>
              <div className="col-span-2 text-slate-200 font-medium">Q1 Revenue Report</div>
              <div className="col-span-1 text-center text-slate-400">8</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  PROCESSED
                </span>
              </div>
              <div className="col-span-1 text-center font-bold text-purple-400">14</div>
              <div className="col-span-1 text-center font-bold text-emerald-400">97%</div>
              <div className="col-span-1 text-right text-slate-400">12.4K</div>
              <div className="col-span-1 text-right text-slate-500">2 min ago</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">raj</div>
              <div className="col-span-2 text-slate-200 font-medium">April Bank Statement</div>
              <div className="col-span-1 text-center text-slate-400">4</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                  PROCESSING
                </span>
              </div>
              <div className="col-span-1 text-center text-slate-600">—</div>
              <div className="col-span-1 text-center text-slate-600">—</div>
              <div className="col-span-1 text-right text-slate-600">—</div>
              <div className="col-span-1 text-right text-slate-500">4 min ago</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">alex</div>
              <div className="col-span-2 text-slate-200 font-medium">Vendor Invoice 003</div>
              <div className="col-span-1 text-center text-slate-400">2</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  PROCESSED
                </span>
              </div>
              <div className="col-span-1 text-center font-bold text-purple-400">3</div>
              <div className="col-span-1 text-center font-bold text-emerald-400">99%</div>
              <div className="col-span-1 text-right text-slate-400">3.2K</div>
              <div className="col-span-1 text-right text-slate-500">11 min ago</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">mei</div>
              <div className="col-span-2 text-slate-200 font-medium">Contractor Payment Apr</div>
              <div className="col-span-1 text-center text-slate-400">1</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-[10px] font-medium text-rose-400 border border-rose-500/20">
                  <div className="w-1 h-1 rounded-full bg-rose-400" />
                  FAILED
                </span>
              </div>
              <div className="col-span-1 text-center text-slate-600">—</div>
              <div className="col-span-1 text-center text-slate-600">—</div>
              <div className="col-span-1 text-right text-slate-400">1.8K</div>
              <div className="col-span-1 text-right text-slate-500">18 min ago</div>
            </div>
            
            {/* Row 5 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">james</div>
              <div className="col-span-2 text-slate-200 font-medium">March Expenses Summary</div>
              <div className="col-span-1 text-center text-slate-400">12</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  PROCESSED
                </span>
              </div>
              <div className="col-span-1 text-center font-bold text-purple-400">31</div>
              <div className="col-span-1 text-center font-bold text-emerald-400">94%</div>
              <div className="col-span-1 text-right text-slate-400">18.7K</div>
              <div className="col-span-1 text-right text-slate-500">24 min ago</div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-8 items-center px-6 py-4 text-[13px] hover:bg-slate-800/20 transition-colors">
              <div className="col-span-1 text-slate-300">nina</div>
              <div className="col-span-2 text-slate-200 font-medium">Client XYZ Statement</div>
              <div className="col-span-1 text-center text-slate-400">6</div>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                  <div className="w-1 h-1 rounded-full bg-blue-400" />
                  REVIEW
                </span>
              </div>
              <div className="col-span-1 text-center font-bold text-purple-400">9</div>
              <div className="col-span-1 text-center font-bold text-amber-400">81%</div>
              <div className="col-span-1 text-right text-slate-400">8.9K</div>
              <div className="col-span-1 text-right text-slate-500">31 min ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { 
  Download, 
  AlertTriangle,
  RotateCcw,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">Document Processing</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            All uploaded PDFs and extraction results across users
          </p>
        </div>
        <Button variant="outline" className="h-9 px-4 border-[#1E293B] bg-[#0F172A] text-slate-300 hover:bg-[#1E293B] hover:text-slate-100">
          <Download className="mr-2 h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Docs */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A]/50 p-5 flex flex-col justify-between h-[120px]">
          <p className="text-[13px] text-slate-400">Total Docs</p>
          <div>
            <div className="text-3xl font-bold text-slate-100">12</div>
            <p className="text-[11px] text-slate-500 mt-1">7 processed</p>
          </div>
        </div>
        
        {/* Transactions Extracted */}
        <div className="rounded-xl border border-purple-900/30 bg-[#171124] p-5 flex flex-col justify-between h-[120px]">
          <p className="text-[13px] text-slate-400">Transactions Extracted</p>
          <div>
            <div className="text-3xl font-bold text-purple-400">103</div>
            <p className="text-[11px] text-slate-500 mt-1">Across all docs</p>
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="rounded-xl border border-emerald-900/30 bg-[#022C22]/50 p-5 flex flex-col justify-between h-[120px]">
          <p className="text-[13px] text-slate-400">Avg Confidence</p>
          <div>
            <div className="text-3xl font-bold text-emerald-400">92.9%</div>
            <p className="text-[11px] text-slate-500 mt-1">Extraction quality</p>
          </div>
        </div>

        {/* Failed Extractions */}
        <div className="rounded-xl border border-rose-900/30 bg-[#2A0E17]/50 p-5 flex flex-col justify-between h-[120px]">
          <p className="text-[13px] text-slate-400">Failed Extractions</p>
          <div>
            <div className="text-3xl font-bold text-rose-500">2</div>
            <p className="text-[11px] text-slate-500 mt-1">Need attention</p>
          </div>
        </div>
      </div>

      {/* Middle Section (Chart + Failed List) */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="col-span-2 rounded-xl border border-[#1E293B] bg-[#0F172A] p-6">
          <h3 className="text-sm font-semibold text-slate-200">This Week — Processing Volume</h3>
          <p className="text-[12px] text-slate-500 mt-1 mb-8">Documents processed vs failed per day</p>
          
          <div className="h-[200px] flex items-end gap-12 px-4 relative">
            {/* Y Axis Guides */}
            <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none pb-6">
              {[28, 21, 14, 7, 0].map(val => (
                <div key={val} className="flex items-center gap-4 w-full">
                  <span className="text-[10px] text-slate-600 w-4 text-right">{val}</span>
                  <div className="flex-1 border-b border-dashed border-slate-800" />
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex flex-1 justify-between items-end pb-6 h-full ml-8">
              {/* Mon */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '45%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '5%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Mon</span>
              </div>
              
              {/* Tue */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '60%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '0%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Tue</span>
              </div>

              {/* Wed */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '55%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '8%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Wed</span>
              </div>

              {/* Thu */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '80%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '0%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Thu</span>
              </div>

              {/* Fri */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '95%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '4%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Fri</span>
              </div>

              {/* Sat */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '30%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '0%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Sat</span>
              </div>

              {/* Sun */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                <div className="flex items-end gap-1 h-[140px] w-full max-w-[40px] justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: '25%' }} />
                  <div className="w-4 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: '0%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Failed Extractions List */}
        <div className="col-span-1 rounded-xl border border-rose-900/30 bg-[#160B12] p-6 flex flex-col h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-200">Failed Extractions</h3>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 -mr-2">
            {/* Fail Card 1 */}
            <div className="p-4 rounded-lg bg-[#0B1120] border border-rose-900/40">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-[13px] font-medium text-slate-200">Contractor_Payment_Apr</h4>
                  <p className="text-[11px] text-slate-500">mei@studio.dev</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[10px] border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">
                  <RotateCcw className="mr-1.5 h-3 w-3" />
                  Retry
                </Button>
              </div>
              <p className="text-[11px] text-rose-400 leading-relaxed mt-3">
                PDF is password-protected. Unable to extract text content.
              </p>
            </div>

            {/* Fail Card 2 */}
            <div className="p-4 rounded-lg bg-[#0B1120] border border-rose-900/40">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-[13px] font-medium text-slate-200">Scanned_Receipt_blur</h4>
                  <p className="text-[11px] text-slate-500">carlos@media.co</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[10px] border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">
                  <RotateCcw className="mr-1.5 h-3 w-3" />
                  Retry
                </Button>
              </div>
              <p className="text-[11px] text-rose-400 leading-relaxed mt-3">
                Image quality too low — OCR confidence below threshold (12%). Please upload a clearer scan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-5">
          <p className="text-[13px] text-slate-400">Total AI Tokens Used</p>
          <div className="mt-2">
            <div className="text-3xl font-bold text-emerald-400">89.6K</div>
            <p className="text-[11px] text-slate-500 mt-1">All extractions</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-5">
          <p className="text-[13px] text-slate-400">Avg Tokens / Doc</p>
          <div className="mt-2">
            <div className="text-3xl font-bold text-blue-400">8.1K</div>
            <p className="text-[11px] text-slate-500 mt-1">Per processed document</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-5">
          <p className="text-[13px] text-slate-400">Avg Cost / Doc</p>
          <div className="mt-2">
            <div className="text-3xl font-bold text-amber-400">$0.020</div>
            <p className="text-[11px] text-slate-500 mt-1">At $2.50 / 1M tokens</p>
          </div>
        </div>
      </div>

      {/* Document Table Area */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by user or filename..."
              className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center p-1 bg-[#1E293B]/50 rounded-lg border border-[#1E293B]">
            <button className="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium">All</button>
            <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-xs font-medium">Processed</button>
            <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-xs font-medium">Processing</button>
            <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-xs font-medium">Review</button>
            <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-xs font-medium">Failed</button>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-8 text-[11px] font-medium text-slate-500 pb-3 border-b border-[#1E293B]">
            <div className="col-span-1">User</div>
            <div className="col-span-2">Document</div>
            <div className="col-span-1 text-center">Pages</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Transactions</div>
            <div className="col-span-1 text-center">Confidence</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          
          <div className="divide-y divide-[#1E293B]/50">
            {/* We can re-use the rows from the Overview here */}
            <div className="grid grid-cols-8 items-center py-4 text-[13px] hover:bg-slate-800/10 transition-colors">
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
              <div className="col-span-1 text-right text-slate-500">2 min ago</div>
            </div>
            {/* Add more rows matching the design if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

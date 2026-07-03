import { GetStartedButton } from '@/components/landing/landing-actions';

export function LandingHero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Radial glow — top-right */}
      <div className="pointer-events-none absolute -top-40 right-0 w-[700px] h-[700px] bg-emerald-50 rounded-full opacity-70 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT COPY ── */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Built for East Africa · Gmail sync live
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 mb-6">
              Stop reading<br />
              bank statements.<br />
              <span className="text-emerald-600">Start asking questions.</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Upload a PDF or connect Gmail and let your AI work for you.
              No spreadsheets. No manual entry. Ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <GetStartedButton label="Get started free" />
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 justify-center h-12 px-6 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                See how it works
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT: Product mockup ── */}
          <div className="relative lg:h-[580px] flex items-center">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 to-transparent rounded-3xl blur-2xl" />

            {/* Main card */}
            <div className="relative w-full rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-300" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500 font-mono">Statement processed</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  92% confidence
                </span>
              </div>

              {/* Statement summary */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">KCB Bank · June 2025</p>
                  <p className="text-xs text-slate-400 mt-0.5">43 transactions extracted</p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-slate-400">Income</p>
                    <p className="text-sm font-bold text-emerald-600">+85,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Expenses</p>
                    <p className="text-sm font-bold text-rose-500">-52,340</p>
                  </div>
                </div>
              </div>

              {/* Transaction rows */}
              <div className="divide-y divide-slate-50">
                {[
                  { desc: 'M-Pesa — Salary Credit', cat: 'Income', amt: '+45,000', type: 'income', conf: 99 },
                  { desc: 'Naivas Supermarket', cat: 'Groceries', amt: '-3,840', type: 'expense', conf: 97 },
                  { desc: 'Shell Petrol Station', cat: 'Fuel', amt: '-6,400', type: 'expense', conf: 96 },
                  { desc: 'Equity — Freelance Pay', cat: 'Income', amt: '+40,000', type: 'income', conf: 99 },
                  { desc: 'Uber — CBD to Westlands', cat: 'Transport', amt: '-480', type: 'expense', conf: 93 },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {tx.type === 'income' ? '↑' : '↓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{tx.desc}</p>
                      <p className="text-xs text-slate-400">{tx.cat}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        KES {tx.amt}
                      </p>
                      <p className="text-xs text-slate-300 font-mono">{tx.conf}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI chat strip */}
              <div className="border-t border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">AI Assistant</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ml-auto" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-200/60 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-slate-600 w-fit">
                    What did I spend on fuel this month?
                  </div>
                  <div className="bg-emerald-600 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white ml-auto w-fit max-w-[85%]">
                    KES 18,430 across 6 transactions. Most expensive: Shell on 14th June — KES 6,400.
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[94%] bg-emerald-400 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono shrink-0">94% confidence</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-white border border-slate-200 shadow-lg rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-700">Gmail synced</span>
            </div>
            <div className="absolute -bottom-3 -left-3 bg-emerald-600 text-white rounded-xl px-3 py-2 shadow-lg shadow-emerald-300">
              <p className="text-xs font-semibold">+KES 85,000</p>
              <p className="text-[10px] opacity-80">income detected</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

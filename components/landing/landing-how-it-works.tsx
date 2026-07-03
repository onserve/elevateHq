export function LandingHowItWorks() {
  const steps = [
    {
      n: '1',
      emoji: '📄',
      title: 'Upload or connect',
      body: 'Drop a PDF bank statement or connect Gmail to pull statements automatically.',
    },
    {
      n: '2',
      emoji: '🔍',
      title: 'AI reads it',
      body: 'Every line item is extracted — amounts, dates, merchants, and transaction types.',
    },
    {
      n: '3',
      emoji: '🏷️',
      title: 'Auto-categorised',
      body: 'Groceries, fuel, income, rent — categorised automatically with confidence scores.',
    },
    {
      n: '4',
      emoji: '💬',
      title: 'Ask anything',
      body: 'Your AI assistant has full context of your documents. Ask in plain language.',
    },
    {
      n: '5',
      emoji: '✅',
      title: 'Review & import',
      body: 'Confirm transactions, tag them to projects, and import into your finance ledger.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            From statement to insight<br />in under a minute.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            No configuration. No setup. Drop a file and the AI handles the rest.
          </p>
        </div>

        {/* Steps pipeline */}
        <div className="relative">
          {/* Horizontal connector (desktop only) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center gap-4">
                {/* Step icon box */}
                <div className="relative z-10 h-16 w-16 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-xl">{step.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <span className="text-xs font-mono text-emerald-500">0{step.n}</span>
                    <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[160px] mx-auto">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom extraction stats card */}
        <div className="mt-16 rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-200" />
            </div>
            <span className="ml-2 text-xs font-mono text-slate-400">elevate.hq/documents/kcb-june-2025</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
              </div>
              <span className="text-xs text-emerald-600 font-semibold">Extracted</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { label: '43 transactions', sub: 'found in statement', icon: '📊' },
              { label: 'KES 52,340', sub: 'total expenses classified', icon: '🏷️' },
              { label: '94% avg confidence', sub: 'across all extractions', icon: '✓' },
            ].map((stat, i) => (
              <div key={i} className="p-6 flex items-center gap-4">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="font-bold text-slate-800">{stat.label}</p>
                  <p className="text-xs text-slate-400">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

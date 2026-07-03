export function LandingAiDemo() {
  const conversations = [
    {
      q: 'How much did I spend on the kitchen renovation last month?',
      a: 'Based on your 3 uploaded statements, you spent KES 47,200 on renovation-related transactions in June — materials at Buildmart KES 31,000 and 2 contractor M-Pesa transfers totalling KES 16,200.',
      conf: 94,
      tags: ['Buildmart', 'Contractor Payment', 'Materials'],
    },
    {
      q: 'What are my biggest expense categories?',
      a: 'Your top 3 this month: Groceries KES 12,840 (25%), Fuel KES 9,200 (18%), and Restaurant / Dining KES 6,100 (12%). Total tracked: KES 52,340.',
      conf: 97,
      tags: ['Groceries', 'Fuel', 'Dining'],
    },
    {
      q: 'Did I receive any income from my side project?',
      a: 'Yes — 4 M-Pesa payments tagged as freelance income: KES 40,000 total, received between 3rd–22nd June. No PAYE deducted — you may want to set aside ~30% for tax.',
      conf: 91,
      tags: ['Freelance', 'M-Pesa', 'Tax note'],
    },
  ];

  return (
    <section id="demo" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            AI Financial Assistant
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            An AI that&apos;s actually read your statements.
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Not generic advice. Real answers from your real documents —
            with the exact transactions to back them up.
          </p>
        </div>

        {/* Chat window */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl shadow-black/30">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">ElevateHQ Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">Contextualised on 3 statements</span>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="p-5 space-y-6">
              {conversations.map((item, i) => (
                <div key={i} className="space-y-3">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-slate-700 text-slate-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">
                      {item.q}
                    </div>
                  </div>
                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-slate-700/50 border border-slate-600/50 text-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                        {item.a}
                      </div>
                      {/* Tags + confidence */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-400 text-xs border border-slate-600">
                            {tag}
                          </span>
                        ))}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <div className="h-1 w-14 rounded-full bg-slate-600 overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.conf}%` }} />
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{item.conf}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fake input bar */}
            <div className="px-5 py-4 border-t border-slate-700">
              <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-slate-700/50 border border-slate-600">
                <span className="text-sm text-slate-500 flex-1">Ask anything about your money...</span>
                <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

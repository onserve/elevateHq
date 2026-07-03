const projects = [
  {
    emoji: '🔨',
    title: 'Kitchen Renovation',
    type: 'Home · Personal',
    budget: 120000,
    spent: 47200,
    insight: 'Tracking well under budget. 2 contractor M-Pesa payments still pending.',
    tags: ['Materials', 'Labour', 'Permits'],
  },
  {
    emoji: '🛍️',
    title: 'Online Boutique',
    type: 'Side Hustle · Business',
    budget: 0,
    spent: 18500,
    revenue: 31200,
    insight: 'Revenue +22% vs last month. Delivery costs are the margin risk.',
    tags: ['Stock', 'Delivery', 'Revenue'],
  },
  {
    emoji: '✈️',
    title: 'Group Trip — Zanzibar',
    type: 'Group · Treasurer',
    budget: 85000,
    spent: 61000,
    insight: 'KES 24,000 remaining target. 3 of 6 members fully contributed.',
    tags: ['Contributions', 'Flights', 'Hotel'],
  },
];

const features = [
  'Transactions auto-tagged from extracted statements',
  'Budget tracking with real numbers, not guesses',
  'Group projects with shared contribution tracking',
  'AI insights per project — not just your whole account',
];

export function LandingProjects() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: sticky copy */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Projects</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Money makes more sense<br />in context.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              Ring-fence transactions inside Projects — a renovation, a side hustle,
              a group trip. Know exactly what each one costs without digging through your bank feed.
            </p>
            <ul className="space-y-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: project cards */}
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{p.emoji}</span>
                      <p className="font-bold text-slate-800">{p.title}</p>
                    </div>
                    <p className="text-xs text-slate-400">{p.type}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    Active
                  </span>
                </div>

                {/* Budget bar or revenue/cost stats */}
                {p.budget > 0 ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Budget: KES {p.budget.toLocaleString()}</span>
                      <span className="font-semibold text-slate-700">
                        {Math.round((p.spent / p.budget) * 100)}% used
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min((p.spent / p.budget) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">KES {p.spent.toLocaleString()} spent</p>
                  </div>
                ) : (
                  <div className="mb-4 flex gap-6">
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="text-sm font-bold text-emerald-600">+KES {(p.revenue ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Costs</p>
                      <p className="text-sm font-bold text-rose-500">-KES {p.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Margin</p>
                      <p className="text-sm font-bold text-slate-700">
                        +KES {((p.revenue ?? 0) - p.spent).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI insight */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <svg className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <p className="text-xs text-emerald-700 leading-relaxed">{p.insight}</p>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mt-3">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

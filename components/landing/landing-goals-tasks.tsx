const features = [
  {
    emoji: '🎯',
    title: 'Goals',
    sub: 'The motivation layer',
    body: 'Emergency fund, holiday savings, school fees — set goals that pull from real transaction data, not manual estimates. Know exactly where you stand.',
    items: ['Emergency fund', 'Holiday savings', 'Business capital'],
  },
  {
    emoji: '✅',
    title: 'Tasks',
    sub: 'The execution layer',
    body: 'Projects that involve money involve actions. Follow up with a contractor, remind a group member, schedule a payment — all in context.',
    items: ['Follow up with contractor', 'Request group contributions', 'Schedule rent payment'],
  },
];

export function LandingGoalsTasks() {
  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">The full picture</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Beyond extraction — goals and tasks keep your financial life moving forward.
          </p>
        </div>

        {/* Feature pair */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-4 mb-5">
                <span className="text-3xl">{f.emoji}</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-slate-800">{f.title}</p>
                    <span className="text-xs text-slate-400">{f.sub}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.body}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {f.items.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

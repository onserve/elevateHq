/**
 * LandingPlatform (exported as LandingProjects for backwards compat with page.tsx)
 *
 * Stripe-inspired platform showcase. Merges the former LandingProjects
 * and LandingGoalsTasks sections into one premium section.
 *
 * Layout:
 *   Desktop → 3-col grid: [left callouts] | [browser mockup] | [right callouts]
 *   Mobile  → browser mockup → 2×2 callout grid
 *   Bottom  → 3-col feature icon strip
 *
 * The dashboard mockup is a static inline replica of the real ElevateHQ
 * app — sidebar, KPI row, projects feed, documents feed, quick actions.
 * No API calls. Pure JSX/CSS.
 */

// ─── Static data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🏗️',
    title: 'Ring-fence projects',
    body: 'Know exactly what each renovation, hustle, or group trip costs — without digging through your feed.',
  },
  {
    icon: '🎯',
    title: 'Goal-linked transactions',
    body: 'Goals that update from real spending, not manual estimates. Know exactly where you stand.',
  },
  {
    icon: '✅',
    title: 'Contextual tasks',
    body: 'Actions that live inside the project where the money is. Follow up, request, schedule — all in context.',
  },
];

const CALLOUTS = [
  {
    side: 'left',
    label: 'Projects',
    description: 'Budget vs actual for every project. Auto-tagged from your statements.',
    colorClass: { dot: 'bg-emerald-500', icon: 'bg-emerald-50 text-emerald-600', accent: 'border-l-emerald-400' },
  },
  {
    side: 'left',
    label: 'Finance',
    description: 'Full cashflow view — revenue, costs, monthly trends from real statements.',
    colorClass: { dot: 'bg-blue-500', icon: 'bg-blue-50 text-blue-600', accent: 'border-l-blue-400' },
  },
  {
    side: 'right',
    label: 'Goals',
    description: 'Savings targets that pull from real transaction data, not estimates.',
    colorClass: { dot: 'bg-violet-500', icon: 'bg-violet-50 text-violet-600', accent: 'border-l-violet-400' },
  },
  {
    side: 'right',
    label: 'Tasks',
    description: 'Follow up with contractors, request contributions — all in project context.',
    colorClass: { dot: 'bg-orange-500', icon: 'bg-orange-50 text-orange-600', accent: 'border-l-orange-400' },
  },
];

// ─── Sidebar nav (icon paths from lucide) ────────────────────────────────────

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    active: true,
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Statements',
    active: false,
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    label: 'Projects',
    active: false,
    d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'Finance',
    active: false,
    d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    label: 'Goals',
    active: false,
    d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    label: 'Tasks',
    active: false,
    d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    label: 'Settings',
    active: false,
    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

// ─── Mock dashboard data ──────────────────────────────────────────────────────

const KPIS = [
  { label: 'Active Projects', value: '3', sub: '2 due this month', up: false },
  { label: 'Statements', value: '7', sub: '2 processing', up: false },
  { label: 'Monthly Revenue', value: 'KES 78.4K', sub: '↑ 12% vs last month', up: true },
];

const PROJECTS_MOCK = [
  { emoji: '🔨', name: 'Kitchen Renovation', status: 'Active', priority: 'HIGH' },
  { emoji: '🛍️', name: 'Online Boutique', status: 'Active', priority: 'MED' },
  { emoji: '✈️', name: 'Group Trip — Zanzibar', status: 'Treasurer', priority: 'LOW' },
];

const DOCS_MOCK = [
  { name: 'KCB June Statement', sub: 'Bank · Jun 2026', status: 'Extracted', ok: true },
  { name: 'M-Pesa May Summary', sub: 'Mobile · May 2026', status: 'Processing', ok: false },
];

const QUICK_ACTIONS = ['New Project', 'Upload Doc', 'Finance', 'Set Goal'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CalloutCard({
  label,
  description,
  colorClass,
}: {
  label: string;
  description: string;
  colorClass: { dot: string; icon: string; accent: string };
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-200/80 border-l-4 ${colorClass.accent}
        shadow-xl shadow-slate-200/60 p-4 w-full max-w-[220px]
        transition-transform hover:-translate-y-0.5 duration-200
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-2 w-2 rounded-full shrink-0 ${colorClass.dot}`} />
        <p className="font-bold text-slate-800 text-sm">{label}</p>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

/** Static browser-frame + dashboard mockup */
function DashboardMockup() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-[10px] shadow-2xl shadow-slate-900/40 ring-1 ring-white/5">
      {/* Browser chrome */}
      <div className="rounded-xl overflow-hidden shadow-xl">
        {/* URL bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 border-b border-slate-200">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="flex-1 mx-3">
            <div className="h-5 rounded-md bg-white border border-slate-200 flex items-center px-2.5 gap-1.5 max-w-xs mx-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[9px] text-slate-400 tracking-tight">
                app.elevatehq.com/dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="flex bg-white overflow-hidden" style={{ height: 420 }}>
          {/* Sidebar */}
          <div className="w-[140px] shrink-0 bg-slate-900 flex flex-col border-r border-slate-800">
            {/* Logo */}
            <div className="flex items-center gap-1.5 px-3 py-3 border-b border-slate-800">
              <div className="h-5 w-5 rounded-md bg-emerald-500 flex items-center justify-center shrink-0">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-white">ElevateHQ</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                    item.active
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                  </svg>
                  <span className="text-[9px] font-medium truncate">{item.label}</span>
                </div>
              ))}
            </nav>

            {/* User pill at bottom */}
            <div className="p-2 border-t border-slate-800">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-[7px] font-bold text-white">S</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold text-white truncate">Sam K.</p>
                  <p className="text-[7px] text-slate-500 truncate">Pro plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-slate-50 overflow-hidden">
            <div className="p-3 space-y-3 h-full overflow-hidden">
              {/* Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Good morning, Sam 👋</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">Friday, 12 July 2026</p>
                </div>
                <div className="h-5 px-2.5 rounded-lg bg-emerald-600 flex items-center shadow-sm">
                  <span className="text-[8px] font-semibold text-white">+ New Project</span>
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-3 gap-2">
                {KPIS.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white rounded-xl border border-slate-100 p-2.5 shadow-sm"
                  >
                    <p className="text-[7px] text-slate-400 mb-1 truncate">{kpi.label}</p>
                    <p className="text-[13px] font-bold text-slate-800 leading-none mb-0.5">{kpi.value}</p>
                    <p className={`text-[7px] truncate ${kpi.up ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      {kpi.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Two-panel grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Projects feed */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5 border-b border-slate-50">
                    <span className="text-[9px] font-semibold text-slate-700">Active Projects</span>
                    <span className="text-[7px] text-slate-400">View all →</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {PROJECTS_MOCK.map((p) => (
                      <div key={p.name} className="flex items-center justify-between px-2.5 py-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[11px] shrink-0">{p.emoji}</span>
                          <span className="text-[9px] font-medium text-slate-700 truncate">
                            {p.name}
                          </span>
                        </div>
                        <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[7px] font-semibold ml-1">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents feed */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5 border-b border-slate-50">
                    <span className="text-[9px] font-semibold text-slate-700">Recent Statements</span>
                    <span className="text-[7px] text-slate-400">Upload →</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {DOCS_MOCK.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between px-2.5 py-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-medium text-slate-700 truncate">{doc.name}</p>
                          <p className="text-[7px] text-slate-400">{doc.sub}</p>
                        </div>
                        <span
                          className={`shrink-0 px-1.5 py-0.5 rounded-full text-[7px] font-semibold ml-1 ${
                            doc.ok
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}

                    {/* Empty state row to fill space */}
                    <div className="flex items-center gap-1.5 px-2.5 py-3">
                      <div className="h-5 w-5 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center shrink-0">
                        <span className="text-[8px] text-slate-400">+</span>
                      </div>
                      <span className="text-[8px] text-slate-400">Upload a statement…</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick actions strip */}
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <div
                    key={action}
                    className="bg-white rounded-lg border border-slate-100 p-2 text-center shadow-sm hover:border-emerald-200 transition-colors"
                  >
                    <p className="text-[8px] font-semibold text-slate-600 truncate">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function LandingProjects() {
  const leftCallouts = CALLOUTS.filter((c) => c.side === 'left');
  const rightCallouts = CALLOUTS.filter((c) => c.side === 'right');

  return (
    <section id="platform" className="pt-16 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            The Platform
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything connected,<br className="hidden sm:block" />nothing missing.
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            From statement upload to project tracking, goals and tasks — one platform, all in context.
          </p>
        </div>

        {/* ── Desktop layout: 3-col grid ──────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-[220px_1fr_220px] lg:gap-6 lg:items-center">

          {/* Left callouts */}
          <div className="flex flex-col gap-5 items-end">
            {leftCallouts.map((c) => (
              <CalloutCard
                key={c.label}
                label={c.label}
                description={c.description}
                colorClass={c.colorClass}
              />
            ))}
          </div>

          {/* Browser frame */}
          <DashboardMockup />

          {/* Right callouts */}
          <div className="flex flex-col gap-5 items-start">
            {rightCallouts.map((c) => (
              <CalloutCard
                key={c.label}
                label={c.label}
                description={c.description}
                colorClass={c.colorClass}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile layout: frame → callout grid ─────────────────────── */}
        <div className="lg:hidden space-y-8">
          <DashboardMockup />

          <div className="grid grid-cols-2 gap-4">
            {CALLOUTS.map((c) => (
              <CalloutCard
                key={c.label}
                label={c.label}
                description={c.description}
                colorClass={c.colorClass}
              />
            ))}
          </div>
        </div>

        {/* ── Feature icon strip ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-10 mt-20 pt-16 border-t border-slate-100">
          {FEATURES.map((f, i) => (
            <div key={i} className="group flex flex-col gap-3">
              <span
                className="text-4xl transition-transform duration-200 group-hover:scale-110 origin-left"
                aria-hidden="true"
              >
                {f.icon}
              </span>
              <h3 className="font-bold text-slate-800 text-base">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

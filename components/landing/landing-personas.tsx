import { GetStartedButton } from '@/components/landing/landing-actions';

interface Persona {
  emoji: string;
  title: string;
  body: string;
}

const personas: Persona[] = [
  {
    emoji: '🧑‍💼',
    title: 'Salaried',
    body: 'Payslip & statements reconciled instantly.',
  },
  {
    emoji: '🛍️',
    title: 'Freelancer',
    body: 'Track side hustle revenue and profit margins.',
  },
  {
    emoji: '🏗️',
    title: 'Renovation',
    body: 'Monitor contractor payments & budgets.',
  },
  {
    emoji: '🤝',
    title: 'Treasurer',
    body: 'Track group contributions transparently.',
  },
  {
    emoji: '🎓',
    title: 'Graduate',
    body: 'Connect transaction data to savings goals.',
  },
  {
    emoji: '🏪',
    title: 'Business',
    body: 'Instantly categorize and analyze business feeds.',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Household',
    body: 'A single shared view of joint accounts.',
  },
];

function PersonaCard({ p }: { p: Persona }) {
  return (
    <div className="aspect-square relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 cursor-default group overflow-hidden">
      {/* Default View (Emoji + Title) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 group-hover:scale-90 group-hover:opacity-0">
        <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">{p.emoji}</span>
        <h4 className="font-bold text-slate-800 text-[11px] sm:text-xs leading-tight">
          {p.title}
        </h4>
      </div>

      {/* Hover View (Absolute positioned overlay containing Emoji + Title + Simplified text) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-emerald-50/20 backdrop-blur-[1px]">
        <span className="text-xl mb-1">{p.emoji}</span>
        <h4 className="font-bold text-emerald-700 text-[10px] leading-tight mb-1">
          {p.title}
        </h4>
        <p className="text-[8px] sm:text-[9px] text-slate-500 leading-normal max-w-[100px] text-center">
          {p.body}
        </p>
      </div>
    </div>
  );
}

export function LandingPersonas() {
  return (
    <section id="who" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP LAYOUT (Andela.com Style) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT CLOUD: Grid Column 1-4 */}
          <div className="col-span-4 grid grid-cols-3 gap-3">
            {/* Column 1 */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <PersonaCard p={personas[0]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
            </div>
            {/* Column 2 */}
            <div className="space-y-3 pt-6">
              <PersonaCard p={personas[1]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <PersonaCard p={personas[2]} />
            </div>
            {/* Column 3 */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <PersonaCard p={personas[4]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
            </div>
          </div>

          {/* CENTER CTA: Grid Column 5-8 */}
          <div className="col-span-4 flex flex-col items-center text-center px-4 max-w-sm mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-3">
              Who it&apos;s for
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-8">
              Built for complex lives.
            </h2>
            <GetStartedButton label="Get started free" />
          </div>

          {/* RIGHT CLOUD: Grid Column 9-12 */}
          <div className="col-span-4 grid grid-cols-3 gap-3">
            {/* Column 1 */}
            <div className="space-y-3 pt-4">
              <PersonaCard p={personas[3]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
            </div>
            {/* Column 2 */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <PersonaCard p={personas[5]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
            </div>
            {/* Column 3 */}
            <div className="space-y-3 pt-8">
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
              <PersonaCard p={personas[6]} />
              <div className="aspect-square bg-slate-50/60 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors duration-300" />
            </div>
          </div>

        </div>

        {/* MOBILE LAYOUT (Clean Grid) */}
        <div className="lg:hidden flex flex-col gap-8">
          <div className="text-center max-w-sm mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-2">
              Who it&apos;s for
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              Built for complex lives.
            </h2>
            <GetStartedButton label="Get started free" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {personas.map((p, i) => (
              <PersonaCard key={i} p={p} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

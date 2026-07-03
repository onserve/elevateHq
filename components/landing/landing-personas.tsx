import { GetStartedButton } from '@/components/landing/landing-actions';

const personas = [
  {
    emoji: '🧑‍💼',
    title: 'Salaried Professional',
    body: 'Upload your payslip and bank statement. Your month is accounted for automatically.',
  },
  {
    emoji: '🛍️',
    title: 'Freelancer & Side Hustler',
    body: "Ring-fence your hustle income in a Project. Know if it's profitable, not just busy.",
  },
  {
    emoji: '🏗️',
    title: 'Renovation Owner',
    body: 'Track every contractor payment and materials receipt in one project view.',
  },
  {
    emoji: '🤝',
    title: 'Group Treasurer',
    body: 'Stop the WhatsApp chaos. Track contributions and group spends transparently.',
  },
  {
    emoji: '🎓',
    title: 'Young Professional',
    body: 'Your first real salary. Set goals that connect to actual transactions, not estimates.',
  },
  {
    emoji: '🏪',
    title: 'Micro-Business Owner',
    body: 'Business account statement → categorised, AI-analysed, ready in minutes.',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Household Manager',
    body: 'Both partners upload statements. One shared view. No arguments about the numbers.',
  },
];

export function LandingPersonas() {
  return (
    <section id="who" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            Who it&apos;s for
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            For people who run complex lives.
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            One salary. A side hustle. Group savings. A renovation. ElevateHQ adapts to
            the way you actually use money.
          </p>
        </div>

        {/* Persona grid — 7 cards + 1 CTA card */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group cursor-default"
            >
              <span className="text-2xl block mb-3">{p.emoji}</span>
              <p className="font-semibold text-slate-800 text-sm mb-1.5 group-hover:text-emerald-600 transition-colors">
                {p.title}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{p.body}</p>
            </div>
          ))}

          {/* CTA card — 8th slot */}
          <div className="p-5 rounded-2xl bg-emerald-600 border border-emerald-700 shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <p className="font-bold text-white text-sm">Sounds like you?</p>
            <p className="text-xs text-emerald-200">Takes 2 minutes to set up.</p>
            <GetStartedButton label="Get started" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

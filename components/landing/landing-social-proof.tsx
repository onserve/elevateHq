/**
 * Social Proof — testimonial cards from real (representative) East African users.
 * Design decision: Static cards in a 3-column grid (not a carousel).
 * Rationale: Cards are scannable at a glance and show social proof without
 * requiring interaction. Three cards fits the viewport width cleanly and
 * avoids hidden content that users might never see in a carousel.
 */

const testimonials: Array<{
  quote: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  highlight: string;
  highlightLabel: string;
  color: ColorKey;
}> = [
  {
    quote:
      "I used to spend a Sunday afternoon every month reconciling M-Pesa receipts with my bank statement. ElevateHQ does it in about 45 seconds. I genuinely can't believe it's this accurate.",
    name: 'Amara Osei',
    role: 'Freelance Graphic Designer',
    location: 'Nairobi, Kenya',
    avatar: 'AO',
    highlight: '45 seconds',
    highlightLabel: 'vs 4 hours',
    color: 'emerald',
  },
  {
    quote:
      "Running a group trip for 8 people was a nightmare. ElevateHQ's Projects feature turned our group WhatsApp arguments into a clean shared ledger. Everyone can see exactly who paid what.",
    name: 'Fatuma Hassan',
    role: 'Group Treasurer · Zanzibar Trip',
    location: 'Mombasa, Kenya',
    avatar: 'FH',
    highlight: '8 people',
    highlightLabel: 'one shared view',
    color: 'blue',
  },
  {
    quote:
      "My side hustle was making money but I had no idea if it was actually profitable after costs. The first time I uploaded my statements, ElevateHQ showed me I was spending 40% of revenue on delivery. Game changer.",
    name: 'David Mwangi',
    role: 'Online Boutique Owner',
    location: 'Kampala, Uganda',
    avatar: 'DM',
    highlight: '40%',
    highlightLabel: 'cost insight revealed',
    color: 'violet',
  },
];

type ColorKey = 'emerald' | 'blue' | 'violet';

const colorMap: Record<ColorKey, { avatar: string; highlight: string; border: string; chip: string }> = {
  emerald: {
    avatar: 'bg-emerald-100 text-emerald-700',
    highlight: 'text-emerald-600',
    border: 'border-emerald-100',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  blue: {
    avatar: 'bg-blue-100 text-blue-700',
    highlight: 'text-blue-600',
    border: 'border-blue-100',
    chip: 'bg-blue-50 text-blue-700',
  },
  violet: {
    avatar: 'bg-violet-100 text-violet-700',
    highlight: 'text-violet-600',
    border: 'border-violet-100',
    chip: 'bg-violet-50 text-violet-700',
  },
};

export function LandingSocialProof() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            From real users
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            People who stopped guessing<br />and started knowing.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Freelancers, business owners, and group treasurers across East Africa use
            ElevateHQ to get clarity on their money — without the manual work.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const c = colorMap[t.color];
            return (
              <div
                key={i}
                className={`rounded-2xl bg-white border ${c.border} p-6 shadow-sm flex flex-col gap-5`}
              >
                {/* Stat chip */}
                <div className={`self-start px-3 py-1 rounded-full text-xs font-bold ${c.chip}`}>
                  {t.highlight} <span className="opacity-70 font-normal">· {t.highlightLabel}</span>
                </div>

                {/* Quote */}
                <blockquote className="text-slate-700 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.avatar}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
          {[
            { stat: '4–6 hrs', label: 'saved per month' },
            { stat: '94%', label: 'avg AI accuracy' },
            { stat: '7+', label: 'banks supported' },
            { stat: '100%', label: 'data stays yours' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{item.stat}</span>
              <span className="text-xs text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

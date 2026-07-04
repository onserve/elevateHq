'use client';

/**
 * Works With — infinite-scroll marquee of supported banks & mobile money providers.
 *
 * Pattern mirrors Andela.com: two identical lists inside one wrapper div,
 * the wrapper translates from 0 → -50% so the second list seamlessly
 * takes over when the first scrolls off-screen.
 *
 * Aesthetic: clean greyscale wordmarks, no flags, no chips — subtle and refined.
 */

const PROVIDERS = [
  { name: 'M-Pesa',             weight: '700' },
  { name: 'KCB Bank',           weight: '400' },
  { name: 'Equity Bank',        weight: '400' },
  { name: 'Co-op Bank',         weight: '400' },
  { name: 'NCBA',               weight: '700' },
  { name: 'Absa',               weight: '700' },
  { name: 'DTB',                weight: '700' },
  { name: 'Standard Chartered', weight: '300' },
  { name: 'I&M Bank',           weight: '400' },
  { name: 'Airtel Money',       weight: '400' },
  { name: 'Stanbic',            weight: '400' },
  { name: 'Family Bank',        weight: '400' },
  { name: 'CRDB Bank',          weight: '700' },
  { name: 'MTN MoMo',           weight: '700' },
];

function Wordmark({ name, weight }: { name: string; weight: string }) {
  return (
    <span
      className="shrink-0 text-slate-400 hover:text-slate-500 transition-colors duration-300 select-none whitespace-nowrap"
      style={{
        fontSize: '1.05rem',
        fontWeight: weight,
        letterSpacing: weight === '700' ? '-0.01em' : '0.01em',
      }}
    >
      {name}
    </span>
  );
}

/** Separator dot between wordmarks */
function Dot() {
  return (
    <span className="shrink-0 h-1 w-1 rounded-full bg-slate-300 self-center" aria-hidden />
  );
}

export function LandingWorksWith() {
  return (
    <section className="py-12 border-y border-slate-100 bg-white overflow-hidden">
      {/* Label */}
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-7">
        Works with
      </p>

      {/* Marquee */}
      <div className="relative">
        {/* Left scrim */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Right scrim */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent" />

        {/* Wrapper — this div animates */}
        <div className="logo-marquee-wrapper flex items-center gap-8">
          {/* List 1 */}
          <div className="flex items-center gap-8 shrink-0" aria-hidden={false}>
            {PROVIDERS.map((p, i) => (
              <span key={`a-${i}`} className="flex items-center gap-8">
                <Wordmark name={p.name} weight={p.weight} />
                <Dot />
              </span>
            ))}
          </div>

          {/* List 2 — duplicate for seamless loop */}
          <div className="flex items-center gap-8 shrink-0" aria-hidden={true}>
            {PROVIDERS.map((p, i) => (
              <span key={`b-${i}`} className="flex items-center gap-8">
                <Wordmark name={p.name} weight={p.weight} />
                <Dot />
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .logo-marquee-wrapper {
          width: max-content;
          will-change: transform;
          animation: works-with-marquee 65s linear infinite;
        }

        @keyframes works-with-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-marquee-wrapper {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

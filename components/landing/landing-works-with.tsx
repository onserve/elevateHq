'use client';

/**
 * Works With — infinite-scroll marquee carousel of supported banks and mobile money providers.
 * Uses a CSS keyframe animation so no JS library is needed.
 * Two identical rows are rendered side-by-side so the loop is seamless.
 */

const PROVIDERS = [
  { name: 'M-Pesa', country: '🇰🇪', type: 'Mobile Money' },
  { name: 'KCB Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'Equity Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'Co-op Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'NCBA', country: '🇰🇪', type: 'Bank' },
  { name: 'Absa Kenya', country: '🇰🇪', type: 'Bank' },
  { name: 'DTB', country: '🇰🇪', type: 'Bank' },
  { name: 'Standard Chartered', country: '🇰🇪', type: 'Bank' },
  { name: 'I&M Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'Airtel Money', country: '🇰🇪', type: 'Mobile Money' },
  { name: 'Stanbic Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'Family Bank', country: '🇰🇪', type: 'Bank' },
  { name: 'T-Kash', country: '🇹🇿', type: 'Mobile Money' },
  { name: 'CRDB Bank', country: '🇹🇿', type: 'Bank' },
  { name: 'MTN MoMo', country: '🇺🇬', type: 'Mobile Money' },
  { name: 'Stanbic Uganda', country: '🇺🇬', type: 'Bank' },
];

function ProviderChip({ name, country, type }: { name: string; country: string; type: string }) {
  const isMobile = type === 'Mobile Money';
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shrink-0 ${
        isMobile
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-slate-200'
      }`}
    >
      <span className="text-lg leading-none">{country}</span>
      <div>
        <p className={`text-sm font-semibold leading-tight ${isMobile ? 'text-emerald-700' : 'text-slate-800'}`}>
          {name}
        </p>
        <p className="text-[10px] text-slate-400 leading-tight">{type}</p>
      </div>
    </div>
  );
}

export function LandingWorksWith() {
  return (
    <section className="py-14 border-y border-slate-100 bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Works with</p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

        <div
          className="flex gap-3"
          style={{
            animation: 'marquee 40s linear infinite',
            width: 'max-content',
          }}
        >
          {/* Render list twice for seamless loop */}
          {[...PROVIDERS, ...PROVIDERS].map((p, i) => (
            <ProviderChip key={i} {...p} />
          ))}
        </div>
      </div>

      {/* Keyframe definition */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
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

// Define 12 slots to construct a complete ellipse (7 personas + 5 empty placeholders)
interface CircularSlot {
  isPersona: boolean;
  emoji?: string;
  title?: string;
  body?: string;
  angle: number; // degrees
}

const SLOTS: CircularSlot[] = [
  { isPersona: false, angle: 0 },
  { isPersona: true, emoji: '🧑‍💼', title: 'Salaried', body: 'Payslip & statements reconciled instantly.', angle: 30 },
  { isPersona: false, angle: 60 },
  { isPersona: true, emoji: '🛍️', title: 'Freelancer', body: 'Track side hustle revenue and profit margins.', angle: 90 },
  { isPersona: false, angle: 120 },
  { isPersona: true, emoji: '🏗️', title: 'Renovation', body: 'Monitor contractor payments & budgets.', angle: 150 },
  { isPersona: true, emoji: '🤝', title: 'Treasurer', body: 'Track group contributions transparently.', angle: 180 },
  { isPersona: false, angle: 210 },
  { isPersona: true, emoji: '🎓', title: 'Graduate', body: 'Connect transaction data to savings goals.', angle: 240 },
  { isPersona: true, emoji: '🏪', title: 'Business', body: 'Instantly categorize and analyze business feeds.', angle: 270 },
  { isPersona: false, angle: 300 },
  { isPersona: true, emoji: '👨‍👩‍👧', title: 'Household', body: 'A single shared view of joint accounts.', angle: 330 },
];

function PersonaCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 cursor-default group overflow-hidden">
      {/* Default view */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 group-hover:scale-90 group-hover:opacity-0">
        <span className="text-2xl sm:text-3xl mb-1.5 transition-transform duration-300 group-hover:scale-110">
          {emoji}
        </span>
        <h4 className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight">
          {title}
        </h4>
      </div>

      {/* Hover view */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-emerald-50/20 backdrop-blur-[1px]">
        <span className="text-lg mb-0.5">{emoji}</span>
        <h4 className="font-bold text-emerald-700 text-[9px] leading-tight mb-0.5">
          {title}
        </h4>
        <p className="text-[7.5px] sm:text-[8.5px] text-slate-500 leading-tight max-w-[85px] text-center">
          {body}
        </p>
      </div>
    </div>
  );
}

export function LandingPersonas() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ellipse dimensions
  const X_RADIUS = 410; // Spreads cards wider across horizontal space
  const Y_RADIUS = 190; // Keeps vertical spacing compact to avoid vertical scroll bloat

  return (
    <section ref={sectionRef} id="who" className="py-6 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP LAYOUT (Andela.com Elliptical Orbit) */}
        <div className="hidden lg:flex items-center justify-center relative min-h-[490px] max-w-5xl mx-auto">
          
          {/* Central CTA - Clean floating text, matching Andela.com */}
          <div className="z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-3">
              Who it&apos;s for
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              Built for complex lives.
            </h2>
            <GetStartedButton label="Get started free" />
          </div>

          {/* Orbiting slots wrapper */}
          <div className="absolute inset-0 pointer-events-none">
            {SLOTS.map((slot, index) => {
              const rad = (slot.angle * Math.PI) / 180;
              const cos = Math.cos(rad);
              const sin = Math.sin(rad);
              const x = Math.round(X_RADIUS * cos);
              const y = Math.round(Y_RADIUS * sin);

              // Calculate style for entry animation: slide inward + scale + fade
              // Only render coordinates on the client to avoid SSR style string mismatches
              const style = mounted ? {
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: isVisible
                  ? 'translate(-50%, -50%) scale(1)'
                  : `translate(calc(-50% + ${cos * 40}px), calc(-50% + ${sin * 40}px)) scale(0.75)`,
                opacity: isVisible ? 1 : 0,
                transition: 'all 850ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${index * 65}ms`,
              } : { opacity: 0 };

              return (
                <div
                  key={index}
                  className="absolute pointer-events-auto"
                  style={style}
                >
                  {slot.isPersona ? (
                    <PersonaCard
                      emoji={slot.emoji!}
                      title={slot.title!}
                      body={slot.body!}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl border border-dashed border-slate-200/60 bg-slate-100/10 transition-colors duration-300 hover:bg-slate-100/40" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE LAYOUT (Clean Grid) */}
        <div className="lg:hidden flex flex-col gap-10">
          <div className="text-center max-w-sm mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-2">
              Who it&apos;s for
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              Built for complex lives.
            </h2>
            <GetStartedButton label="Get started free" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {personas.map((p, i) => (
              <div
                key={i}
                className={`transition-all duration-700 delay-[${i * 100}ms] ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
              >
                <div className="aspect-square relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 cursor-default group overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 transition-all duration-300 group-hover:scale-90 group-hover:opacity-0">
                    <span className="text-3xl mb-2">{p.emoji}</span>
                    <h4 className="font-bold text-slate-800 text-xs leading-tight">
                      {p.title}
                    </h4>
                  </div>
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

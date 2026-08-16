'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Social Proof — Testimonial carousel from real (representative) East African users.
 * Features:
 * - Responsive viewport items (1 on mobile, 2 on tablet, 3 on desktop)
 * - Navigation arrows (floating on sides, desktop only)
 * - Carousel dots indicator (all viewports)
 * - Autoplay transitions (every 5 seconds, pauses on hover)
 */

type ColorKey = 'emerald' | 'blue' | 'violet';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  highlight: string;
  highlightLabel: string;
  color: ColorKey;
}

const testimonials: Testimonial[] = [
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
  {
    quote:
      "Setting savings goals linked directly to KCB and M-Pesa is a lifesaver. I know exactly how much I have left to hit my target without guess-estimating at the end of the week.",
    name: 'Kevin Mwangi',
    role: 'Software Engineer',
    location: 'Nairobi, Kenya',
    avatar: 'KM',
    highlight: 'Real-time sync',
    highlightLabel: 'with KCB & M-Pesa',
    color: 'emerald',
  },
  {
    quote:
      "My wife and I sync our statements to one dashboard. Reconciling household expenses has gone from hours of spreadsheets and arguments to a single, shared source of truth.",
    name: 'Amina & John',
    role: 'Household Managers',
    location: 'Mombasa, Kenya',
    avatar: 'AJ',
    highlight: '1 shared view',
    highlightLabel: 'joint ledger sync',
    color: 'blue',
  },
];

const colorMap: Record<ColorKey, { avatar: string; highlight: string; border: string; chip: string }> = {
  emerald: {
    avatar: 'bg-emerald-100 text-emerald-700',
    highlight: 'text-emerald-600',
    border: 'border-emerald-100 hover:border-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  blue: {
    avatar: 'bg-blue-100 text-blue-700',
    highlight: 'text-blue-600',
    border: 'border-blue-100 hover:border-blue-200',
    chip: 'bg-blue-50 text-blue-700',
  },
  violet: {
    avatar: 'bg-violet-100 text-violet-700',
    highlight: 'text-violet-600',
    border: 'border-violet-100 hover:border-violet-200',
    chip: 'bg-violet-50 text-violet-700',
  },
};

function TestimonialCard({ t }: { t: Testimonial }) {
  const c = colorMap[t.color];
  return (
    <div className={`h-full rounded-2xl bg-white border ${c.border} p-6 shadow-sm flex flex-col gap-5 transition-all duration-300`}>
      {/* Stat chip */}
      <div className={`self-start px-3 py-1 rounded-full text-[11px] font-bold ${c.chip}`}>
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
}

export function LandingSocialProof() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = testimonials.length - visibleCount;

  const nextSlide = () => {
    setActiveIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Autoplay loop
  useEffect(() => {
    if (!mounted || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [visibleCount, mounted, isHovered, maxIndex]);

  return (
    <section className="pt-20 pb-12 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            From real users
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            People who stopped guessing
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Freelancers, business owners, group treasurers and individuals use
            ElevateHQ to get clarity on their money — without the manual work.
          </p>
        </div>

        {/* Carousel Section wrapper */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows (Desktop only, visible on hover container) */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-20"
            aria-label="Previous testimonials"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-20"
            aria-label="Next testimonials"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Track viewport */}
          <div className="overflow-hidden w-full px-1 py-2">
            <div
              className="flex transition-transform duration-500 ease-out mx-[-12px]"
              style={{
                transform: `translateX(-${activeIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="shrink-0 px-3"
                  style={{
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator (renders dynamic length based on slide boundaries) */}
          {mounted && maxIndex > 0 && (
            <div className="flex justify-center gap-2.5 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * LandingAiDemo — Refined interactive layout containing:
 * 1. Smooth Typed Chat Preview (Left Col): Character-by-character typed flow with smooth auto-scroll.
 * 2. Premium SVG Step Cards (Right Col): Elegant outline cards with glassmorphic hover effects.
 *
 * Prevents hydration mismatches using a client mount-gate.
 */

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  tags?: string[];
  conf?: number;
}

interface StepItem {
  n: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}

const conversations = [
  {
    q: 'How much did I spend on the kitchen renovation last month?',
    a: 'KES 47,200 in June — Buildmart KES 31,000 + 2 M-Pesa contractor transfers of KES 16,200.',
    tags: ['Buildmart', 'Contractor Payment', 'Materials'],
    conf: 94,
  },
  {
    q: 'What are my biggest expense categories?',
    a: 'Groceries KES 12,840 · Fuel KES 9,200 · Dining KES 6,100. Total: KES 52,340.',
    tags: ['Groceries', 'Fuel', 'Dining'],
    conf: 97,
  },
  {
    q: 'Did I receive any income from my side project?',
    a: 'Yes — 4 M-Pesa credits totalling KES 40,000, 3rd–22nd June. No PAYE deducted — set aside ~30% for tax.',
    tags: ['Freelance', 'M-Pesa', 'Tax note'],
    conf: 91,
  },
];

export function LandingAiDemo() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTypedText, setActiveTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'user_typing' | 'waiting_assistant' | 'assistant_typing' | 'done_item' | 'reset'>('user_typing');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mount gate to avoid Next.js hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom immediately as user/assistant types
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeTypedText]);

  // Smooth scroll to bottom when new bubbles enter
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, phase]);

  // Typing simulation state machine
  useEffect(() => {
    if (!mounted) return;

    let timer: NodeJS.Timeout;
    let charIndex = 0;

    if (phase === 'user_typing') {
      const fullText = conversations[index].q;
      setActiveTypedText('');
      
      const interval = setInterval(() => {
        charIndex++;
        setActiveTypedText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          clearInterval(interval);
          timer = setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'user', text: fullText }]);
            setActiveTypedText('');
            setPhase('waiting_assistant');
          }, 800); // Hold question in input bar for 800ms before sending
        }
      }, 35); // Human-like typing speed (35ms/char)

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    if (phase === 'waiting_assistant') {
      timer = setTimeout(() => {
        setPhase('assistant_typing');
      }, 1500); // 1.5s typing delay to look authentic

      return () => clearTimeout(timer);
    }

    if (phase === 'assistant_typing') {
      const fullText = conversations[index].a;
      setActiveTypedText('');

      const interval = setInterval(() => {
        charIndex++;
        setActiveTypedText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          clearInterval(interval);
          timer = setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                sender: 'assistant',
                text: fullText,
                tags: conversations[index].tags,
                conf: conversations[index].conf,
              },
            ]);
            setActiveTypedText('');
            setPhase('done_item');
          }, 300);
        }
      }, 18); // Assistant types slightly faster (18ms/char)

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    if (phase === 'done_item') {
      timer = setTimeout(() => {
        if (index < conversations.length - 1) {
          setIndex(prev => prev + 1);
          setPhase('user_typing');
        } else {
          setPhase('reset');
        }
      }, 5000); // Give user 5 seconds reading time per Q&A block

      return () => clearTimeout(timer);
    }

    if (phase === 'reset') {
      timer = setTimeout(() => {
        setMessages([]);
        setIndex(0);
        setPhase('user_typing');
      }, 6000); // Pause for 6 seconds at the end showing full context, then reset loop

      return () => clearTimeout(timer);
    }
  }, [phase, index, mounted]);

  const steps: StepItem[] = [
    {
      n: '1',
      title: 'Upload or connect',
      body: 'Drop a PDF bank statement or connect Gmail to pull statements automatically.',
      icon: (
        <svg className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      n: '2',
      title: 'Our engine reads it',
      body: 'Every amount, date and merchant is extracted from your statement.',
      icon: (
        <svg className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-4H7Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v4h4" />
        </svg>
      ),
    },
    {
      n: '3',
      title: 'Ask anything',
      body: 'The system has full context of your documents. Ask in plain language.',
      icon: (
        <svg className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      n: '4',
      title: 'Review & tag',
      body: 'Confirm transactions, assign to a project or goal, and it\'s in your ledger.',
      icon: (
        <svg className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="demo" className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your statements, fully understood.
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Animated Chat Window ── */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto">
            <div className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl shadow-black/30">
              
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">ElevateHQ Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400">Contextualised on 3 statements</span>
                  </div>
                </div>
              </div>

              {/* Chat Conversation Body */}
              <div
                ref={chatContainerRef}
                className="p-5 space-y-4 h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex flex-col justify-start"
              >
                {/* Fallback state when SSR loads */}
                {!mounted && (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                    Initializing secure engine session...
                  </div>
                )}

                {/* Render typed message history */}
                {mounted && messages.map((msg, i) => (
                  <div key={i} className="space-y-2">
                    {msg.sender === 'user' ? (
                      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-slate-700 text-slate-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="h-6 w-6 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-slate-700/50 border border-slate-600/50 text-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                            {msg.text}
                          </div>
                          {msg.tags && (
                            <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300">
                              {msg.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-400 text-xs border border-slate-600">
                                  {tag}
                                </span>
                              ))}
                              {msg.conf !== undefined && (
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <div className="h-1 w-14 rounded-full bg-slate-600 overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${msg.conf}%` }} />
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{msg.conf}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}


                {/* Bouncing typing dots for assistant */}
                {mounted && phase === 'waiting_assistant' && (
                  <div className="flex gap-3 animate-in fade-in duration-200">
                    <div className="h-6 w-6 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-700/30 border border-slate-600/30 px-4 py-2.5 rounded-2xl rounded-tl-sm w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dot-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dot-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dot-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {/* Render active typing answer */}
                {mounted && phase === 'assistant_typing' && activeTypedText && (
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-slate-700/50 border border-slate-600/50 text-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                        {activeTypedText}
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-emerald-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fake Input Bar */}
              <div className="px-5 py-4 border-t border-slate-700 bg-slate-800/80">
                <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className={`text-xs sm:text-sm flex-1 ${mounted && phase === 'user_typing' ? 'text-slate-100' : 'text-slate-500'}`}>
                    {mounted && phase === 'user_typing' ? (
                      <span className="flex items-center">
                        {activeTypedText}
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-emerald-400 animate-pulse" />
                      </span>
                    ) : (
                      'Ask anything about your money...'
                    )}
                  </span>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${mounted && phase === 'user_typing' && activeTypedText.length === conversations[index].q.length ? 'bg-emerald-500 text-white' : 'bg-slate-700/80 text-slate-400'}`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN: How It Works Steps ── */}
          <div className="lg:col-span-5 w-full">
            <div className="space-y-4 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden lg:block absolute left-10 top-10 bottom-10 w-[2px] bg-slate-800" />

              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-6 relative items-start p-4 rounded-xl border border-transparent hover:bg-slate-800/40 hover:border-slate-800/60 transition-all duration-300 group cursor-default"
                >
                  {/* Step icon number */}
                  <div className="relative z-10 h-12 w-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0 shadow-inner group-hover:bg-slate-700 group-hover:border-slate-600 transition-all duration-300">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Styled Staged Keyframe Animations */}
      <style>{`
        /* Dot bounce anim */
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .dot-bounce {
          animation: dot-bounce 0.8s infinite ease-in-out;
          display: inline-block;
        }

        /* Custom scrollbar adjustments */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </section>
  );
}

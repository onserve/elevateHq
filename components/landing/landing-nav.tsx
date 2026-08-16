import { GetStartedButton, SignInLink } from '@/components/landing/landing-actions';

export function LandingNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
              <path
                d="M9 12h6M9 16h4M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-4H7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 4v4h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">ElevateHQ</span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            How it works
          </a>
          <a href="#demo" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            AI Demo
          </a>
          <a href="#who" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Who it&apos;s for
          </a>
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-5">
          <SignInLink />
          <GetStartedButton label="Get started" className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}

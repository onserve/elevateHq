/**
 * Compact, single-row minimalist footer.
 * Cut in half in terms of height, product links column removed,
 * and includes a dedicated placeholder slot for developer portfolio website link.
 */

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand info */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white">
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
            <div>
              <span className="text-xs font-bold text-white block leading-none">ElevateHQ</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Built in Nairobi 🇰🇪</span>
            </div>
          </div>

          {/* Right: Credits & Portfolio Link placeholder */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="text-slate-500">
              © {new Date().getFullYear()} ElevateHQ. All rights reserved.
            </span>
            
            {/* Portfolio Link placeholder */}
            <a 
              href="https://yourportfolio.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium border-l border-slate-800 pl-6"
            >
              Developer Portfolio →
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

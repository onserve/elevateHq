/**
 * Simplified footer — Brand + Product columns only.
 * Removed: Security column, sitemap, large layout.
 */

const productLinks = [
  'Document Extraction',
  'Gmail Integration',
  'AI Assistant',
  'Projects',
  'Goals & Tasks',
];

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center">
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
              <span className="text-sm font-bold text-white">ElevateHQ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Financial intelligence for East Africa.<br />Built in Nairobi 🇰🇪
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Product</p>
            <div className="space-y-2">
              {productLinks.map(l => (
                <p key={l} className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-default">
                  {l}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} ElevateHQ. All rights reserved.</p>
          <p className="text-xs text-slate-600">Made with 💚 in Nairobi</p>
        </div>
      </div>
    </footer>
  );
}

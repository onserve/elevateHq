'use client';

import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AiInsightBannerProps {
  message: string;
  href?: string;
  reviewLabel?: string;
}

export function AiInsightBanner({
  message,
  href,
  reviewLabel = 'Review',
}: AiInsightBannerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10">
      <div className="shrink-0 p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
      <p className="flex-1 text-sm text-amber-800 dark:text-amber-300 leading-snug">
        {message}
      </p>
      {href && (
        <Link
          href={href}
          className="shrink-0 flex items-center gap-1 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
        >
          {reviewLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

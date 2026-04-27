'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginatedResponse } from '@/lib/api/server-api-client';

interface ListPaginationProps {
  /** The full paginated response metadata */
  data: Pick<PaginatedResponse<unknown>, 'totalPages' | 'totalElements' | 'number' | 'size' | 'first' | 'last'>;
  /** Called when the user navigates to a new page (0-indexed) */
  onPageChange: (page: number) => void;
  /** How many page buttons to show around the current page */
  siblingCount?: number;
}

function buildPageRange(current: number, total: number, sibling: number): (number | '...')[] {
  // Always show first, last and a window around current
  const delta = sibling + 1;
  const range: number[] = [];
  const rangeWithDots: (number | '...')[] = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total - 2, current + delta);

  for (let i = start; i <= end; i++) range.push(i);

  let prev: number | undefined;
  // Always include page 0
  rangeWithDots.push(0);
  for (const i of range) {
    if (prev !== undefined && i - prev > 1) rangeWithDots.push('...');
    rangeWithDots.push(i);
    prev = i;
  }
  // Always include last page
  if (total > 1) {
    const last = total - 1;
    if (prev !== undefined && last - prev > 1) rangeWithDots.push('...');
    if (!rangeWithDots.includes(last)) rangeWithDots.push(last);
  }

  return rangeWithDots;
}

export function ListPagination({
  data,
  onPageChange,
  siblingCount = 1,
}: ListPaginationProps) {
  const { totalPages, totalElements, number: currentPage, size, first, last } = data;

  const pages = totalPages > 1 ? buildPageRange(currentPage, totalPages, siblingCount) : [];

  const startItem = currentPage * size + 1;
  const endItem = Math.min((currentPage + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
      {/* Record count */}
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-semibold text-foreground">{startItem}–{endItem}</span>
        {' '}of{' '}
        <span className="font-semibold text-foreground">{totalElements}</span> results
      </p>

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={first}
            onClick={() => onPageChange(0)}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={first}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {pages.map((page, idx) =>
            page === '...' ? (
              <span
                key={`dots-${idx}`}
                className="px-2 text-muted-foreground select-none text-sm"
              >
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8 text-sm font-medium"
                onClick={() => onPageChange(page as number)}
                aria-label={`Page ${(page as number) + 1}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {(page as number) + 1}
              </Button>
            ),
          )}

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={last}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={last}
            onClick={() => onPageChange(totalPages - 1)}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

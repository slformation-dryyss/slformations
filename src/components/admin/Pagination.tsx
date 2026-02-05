
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page) => (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`flex items-center justify-center min-w-[2.5rem] h-10 px-2 rounded-xl border font-bold text-sm transition-all shadow-sm ${
              currentPage === page
                ? 'bg-gold-500 border-gold-500 text-navy-900'
                : 'bg-white border-slate-200 text-slate-600 hover:border-gold-500 hover:text-gold-600'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

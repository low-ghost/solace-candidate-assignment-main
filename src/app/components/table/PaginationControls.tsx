import { memo, useCallback, useState } from 'react';
import { Select } from '../ui/Select';

export type PaginationControlsProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
};

export const getPageNumbers = (
  current: number,
  total: number,
): Array<number | string> => {
  const delta = 2;
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);
  const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return [
    // always include the first page
    1,
    // add ellipsis if needed between 1 and start
    ...(start > 2 ? ['...' as const] : []),
    // add the range, excluding 1 and total
    ...range.filter((n) => n !== 1 && n !== total),
    // add ellipsis if needed between end and total
    ...(end < total - 1 ? ['...'] : []),
    // always include the last page if total > 1
    ...(total > 1 ? [total] : []),
  ];
};

/**
 * Pagination controls for the table.
 * Adapted from https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/pagination#component-69eb9381f977800aa890ce8f7d9e2d20
 */
export const PaginationControls = memo(
  ({
    page,
    setPage,
    totalPages,
    limit,
    setLimit,
    total,
  }: PaginationControlsProps) => {
    const pageNumbers = getPageNumbers(page, totalPages);
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return (
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Showing <span className="font-medium">{start}</span> to{' '}
              <span className="font-medium">{end}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </span>
            <label
              htmlFor="limit"
              className="text-sm text-gray-700 dark:text-gray-200 ml-4"
            >
              Show
            </label>
            <Select
              id="limit"
              value={limit}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              per page
            </span>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-xs"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-gray-300 dark:ring-gray-700 ring-inset hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {pageNumbers.map((num, idx) =>
                num === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-700 ring-inset focus:outline-offset-0 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={num}
                    onClick={() => setPage(Number(num))}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 dark:ring-gray-700 ring-inset focus:z-20 focus:outline-offset-0 ${
                      page === num
                        ? 'z-10 bg-blue-800 text-blue-100 dark:bg-blue-900 dark:text-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-900'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${idx === 0 ? 'rounded-l-md' : ''} ${
                      idx === pageNumbers.length - 1 ? 'rounded-r-md' : ''
                    }`}
                    aria-current={page === num ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-gray-300 dark:ring-gray-700 ring-inset hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  },
);

export const usePaginationControls = (initialLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  // Reset page to 1 if limit changes
  const setLimitAndResetPage = useCallback((newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  }, []);

  return {
    page,
    setPage,
    limit,
    setLimit: setLimitAndResetPage,
  };
};

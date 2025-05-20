'use client';

import { AlertCircle, Loader, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  PaginationControls,
  Table,
  TableData,
  usePaginationControls,
} from './components/table';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { useAdvocates } from './use-advocates';

const headers = [
  'First Name',
  'Last Name',
  'City',
  'Degree',
  'Specialties',
  'Years of Experience',
  'Phone Number',
];

const useDebounce = <T extends {}>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const formatPhoneNumber = (phoneNumber?: number | string) =>
  String(phoneNumber)?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { page, setPage, limit, setLimit } = usePaginationControls(10);
  const { advocates, total, isLoading, error } = useAdvocates(
    debouncedSearch,
    page,
    limit,
  );
  const totalPages = Math.ceil(total / limit);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1); // reset to first page on new search
    setSearchTerm(e.target.value);
  }, []);

  const onReset = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, []);

  return (
    <>
      <header className="w-full flex items-center justify-between px-8 py-5 mb-8 bg-white/80 dark:bg-gray-900/80 shadow-lg rounded-b-2xl backdrop-blur-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Solace Advocates
        </h1>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Search
          </label>
          <div className="flex items-center gap-2 mb-1">
            <Input
              id="search"
              className=""
              value={searchTerm}
              onChange={onChange}
              placeholder="Search advocates..."
              type="text"
            />
            <Button onClick={onReset} className="ml-2 text-sm" type="button">
              Reset
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 animate-pulse">
            <Loader className="w-8 h-8 mb-3 text-blue-400 animate-spin" />
            <span>Loading advocates...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <span className="font-medium">Something went wrong</span>
            <span className="text-sm mt-1">{error.message}</span>
          </div>
        ) : advocates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
            <Users className="w-8 h-8 mb-3" />
            <span>No advocates found.</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <Table headers={headers}>
                {advocates.map((advocate: any) => (
                  <tr
                    key={advocate.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableData>{advocate.firstName}</TableData>
                    <TableData>{advocate.lastName}</TableData>
                    <TableData>{advocate.city}</TableData>
                    <TableData>{advocate.degree}</TableData>
                    <TableData>
                      <div className="flex flex-wrap gap-1">
                        {advocate.specialties.map((s: string, i: number) => (
                          <span
                            key={s + i}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-100"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </TableData>
                    <TableData>{advocate.yearsOfExperience}</TableData>
                    <TableData>
                      {formatPhoneNumber(advocate.phoneNumber)}
                    </TableData>
                  </tr>
                ))}
              </Table>
            </div>
            <PaginationControls
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
              setLimit={setLimit}
              total={total}
            />
          </>
        )}
      </main>
    </>
  );
}

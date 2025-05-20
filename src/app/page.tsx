'use client';

import { useState } from 'react';
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { page, setPage, limit, setLimit } = usePaginationControls(10);
  const { advocates, total, isLoading, error } = useAdvocates(
    searchTerm,
    page,
    limit,
  );
  const totalPages = Math.ceil(total / limit);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1); // Reset to first page on new search
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    setSearchTerm('');
    setPage(1);
  };

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
            <Button onClick={onClick} className="ml-2 text-sm" type="button">
              Reset
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error: {error.message}
          </div>
        ) : advocates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No advocates found.
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
                    <TableData>{advocate.phoneNumber}</TableData>
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

'use client';

import { useState } from 'react';
import { useAdvocates } from './use-advocates';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
    <main style={{ margin: '24px' }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <input
          style={{ border: '1px solid black' }}
          value={searchTerm}
          onChange={onChange}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Error: {error.message}</div>
      ) : advocates.length === 0 ? (
        <div>No advocates found.</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Degree</th>
                <th>Specialties</th>
                <th>Years of Experience</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {advocates.map((advocate: any) => (
                <tr key={advocate.id}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s: string, i: number) => (
                      <div key={s + i}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span style={{ margin: '0 8px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
            <span style={{ marginLeft: '16px' }}>
              Show
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                style={{ margin: '0 4px' }}
              >
                {[5, 10, 20, 50].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              per page
            </span>
            <span style={{ marginLeft: '16px' }}>Total: {total}</span>
          </div>
        </>
      )}
    </main>
  );
}

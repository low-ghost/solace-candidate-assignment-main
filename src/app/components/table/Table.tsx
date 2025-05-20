import React, { memo } from 'react';

export const TableHeaderCell = memo(
  ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
      {children}
    </th>
  ),
);

export const TableData = memo(({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
    {children}
  </td>
));

type TableProps = {
  headers: string[];
  children: React.ReactNode;
};

export const Table = ({ headers, children }: TableProps) => (
  <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
    <thead>
      <tr>
        {headers.map((header) => (
          <TableHeaderCell key={header}>{header}</TableHeaderCell>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  </table>
);

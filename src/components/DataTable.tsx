import React from 'react';
import { RowData } from '../types';

interface DataTableProps {
  data: RowData[];
  onCellEdit: (rowIndex: number, field: string, value: string) => void;
}

export function DataTable({ data, onCellEdit }: DataTableProps) {
  const calculateTotals = () => ({
    Qty: data.reduce((sum, row) => sum + (row.Qty as number), 0),
    'Klint PU': data.reduce(
      (sum, row) =>
        sum +
        (parseFloat(
          row[' Klint PU ']
            .toString()
            .replace(/[^0-9,.]/g, '')
            .replace(',', '.')
        ) || 0),
      0
    ),
    'Total Klint': data.reduce(
      (sum, row) =>
        sum +
        (parseFloat(
          row[' Total Klint ']
            .toString()
            .replace(/[^0-9,.]/g, '')
            .replace(',', '.')
        ) || 0),
      0
    ),
  });

  const totals = calculateTotals();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Line No
            </th>
            {Object.keys(data[0]).map((header) => (
              <th
                key={header.trim()}
                className="border px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {header.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-gray-600">{rowIndex + 1}</td>
              {Object.entries(row).map(([key, value], cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className="border px-4 py-2"
                >
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onCellEdit(rowIndex, key, e.target.value)}
                    className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td colSpan={1} className="border px-4 py-2 text-right">
              Totals:
            </td>
            <td className="border px-4 py-2">{totals.Qty}</td>
            <td className="border px-4 py-2"></td>
            <td className="border px-4 py-2">
              {totals['Klint PU'].toFixed(2)}
            </td>
            <td className="border px-4 py-2">
              {totals['Total Klint'].toFixed(2)}
            </td>
            <td colSpan={2} className="border px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

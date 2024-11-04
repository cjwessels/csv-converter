import React, { useState } from 'react';
import { RowData } from './types';
import { FileUpload } from './components/FileUpload';
import { ExportButton } from './components/ExportButton';
import { DataTable } from './components/DataTable';
import { EmptyState } from './components/EmptyState';
import { processExcelFile, generateCSV } from './utils/excel';

function App() {
  const [data, setData] = useState<RowData[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const processedData = processExcelFile(e.target?.result as string);
      setData(processedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    const newData = [...data];
    let processedValue: string | number = value;

    if (field === 'Qty') {
      processedValue = parseInt(value) || 0;
    } else if (field.trim() === 'Klint PU' || field.trim() === 'Total Klint') {
      processedValue =
        parseFloat(value.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
    }

    newData[rowIndex] = { ...newData[rowIndex], [field]: processedValue };
    setData(newData);
  };

  const handleExport = () => {
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            SARS File Prep
          </h1>

          <div className="flex gap-4 mb-8">
            <FileUpload onFileUpload={handleFileUpload} />
            {data.length > 0 && <ExportButton onClick={handleExport} />}
          </div>

          {data.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable data={data} onCellEdit={handleCellEdit} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

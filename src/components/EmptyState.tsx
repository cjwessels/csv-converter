import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <FileSpreadsheet size={48} className="mb-4" />
      <p>Upload an XLSX file to begin processing</p>
    </div>
  );
}
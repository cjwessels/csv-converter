import { read, utils } from 'xlsx';
import { RowData } from '../types';

export const processExcelFile = (
  fileContent: string | ArrayBuffer
): RowData[] => {
  const wb = read(fileContent, { type: 'binary' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const jsonData: any[] = utils.sheet_to_json(ws, { raw: false });

  return jsonData.map((row) => ({
    ...row,
    DTYPE: row.DTYPE || 'DP',
    Qty: parseInt(row.Qty) || 0,
    ' Klint PU ':
      parseFloat(
        row[' Klint PU ']
          ?.replace(/[^0-9,.]/g, '')
          .replace(',', '.')
          .trim()
      ) || 0,
    ' Total Klint ':
      parseFloat(
        row[' Total Klint ']
          ?.replace(/[^0-9,.]/g, '')
          .replace(',', '.')
          .trim()
      ) || 0,
  }));
};

export const generateCSV = (data: RowData[]): string => {
  console.log(data);
  const csvData = data.map((row, index) => ({
    'Line No': (index + 1).toString(),
    'D/Type': row.DTYPE || 'DP',
    TariffCode: row['HS Code'],
    'C/O': row.COO,
    'Duty Rate': 'EU',
    'Fob Value': row[' Total Klint '],
    'Actual Price': row[' Total Klint '],
    'Stat 1': row.Qty,
    'Stat 2': '',
    'Stat 3': '',
    'Part No.': '',
    'Sched 2 Code': '',
    'Part 2 b Item': '',
    'Part 2 a Item': '',
    'Permit No': '',
    'Pay Vat': '',
    // 'Duty Rate': '',
    'High Risk Uplift Rate': '',
    'Customs Value': '',
    'Costing Factor': '',
    'Costing Unit Price': '',
    'Trade Agreement': '',
    DUTY_RATE: '',
  }));

  const headers = Object.keys(csvData[0]);
  return [
    headers.join(';'),
    ...csvData.map((row) =>
      headers.map((header) => row[header as keyof typeof row]).join(';')
    ),
  ].join('\n');
};

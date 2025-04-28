/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

interface Column {
  key: string;
  header: string;
  cell?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  caption?: string;
}

export const DataTable = ({ data, columns, caption }: DataTableProps) => {
  const { t } = useTranslation();
  
  return (
    <Table>
      {caption && <TableCaption>{typeof caption === 'string' ? t(caption) : caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{typeof column.header === 'string' ? t(column.header) : column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={item.id || i}>
            {columns.map((column) => (
              <TableCell key={`${item.id || i}-${column.key}`}>
                {column.cell ? column.cell(item) : item[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

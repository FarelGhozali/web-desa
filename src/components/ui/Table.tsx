import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className={cn('w-full text-left text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-stone-50 text-stone-700', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-stone-200', className)}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={cn('hover:bg-stone-50 transition-colors', className)}>
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th className={cn('px-6 py-3 font-semibold text-left', className)}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 text-stone-900', className)}>{children}</td>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  RowSelectionState
} from '@tanstack/react-table';
import { Transaction } from '@/lib/api/service/document-service';
import { useProjectOptions } from '@/lib/query/use-projects';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const MOCK_CATEGORIES = [
  'Salary', 'Freelance', 'Software', 'Hardware', 'Travel', 'Meals', 'Office Supplies', 'Marketing'
];

interface TransactionReviewTableProps {
  transactions: Transaction[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function TransactionReviewTable({ transactions, onSelectionChange }: TransactionReviewTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [editedData, setEditedData] = useState<Record<string, Partial<Transaction>>>({});
  
  const { data: projectOptions = [] } = useProjectOptions();

  const handleEdit = (id: string, field: keyof Transaction, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        header: 'TYPE',
        accessorKey: 'type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return type === 'INCOME' ? (
            <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
          ) : (
             <ArrowDownCircle className="w-5 h-5 text-rose-500" />
          )
        }
      },
      {
        header: 'DATE',
        accessorKey: 'date',
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue('date')}</span>
      },
      {
        header: 'DESCRIPTION / VENDOR',
        accessorKey: 'description',
        cell: ({ row }) => (
           <div>
             <div className="font-bold text-sm">{row.getValue('description')}</div>
             <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
               {row.original.vendor} 
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                 row.original.confidenceLabel === 'HIGH' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                 row.original.confidenceLabel === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 
                 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
               }`}>
                 {row.original.confidenceLabel}
               </span>
             </div>
           </div>
        )
      },
      {
        header: 'CATEGORY',
        id: 'category',
        cell: ({ row }) => {
           const id = row.original.id;
           const value = editedData[id]?.category || row.original.category || '';
           return (
             <Select value={value} onValueChange={(val) => handleEdit(id, 'category', val)}>
               <SelectTrigger className="w-[140px] h-8 text-xs border-0 bg-muted/30">
                 <SelectValue placeholder="Select..." />
               </SelectTrigger>
               <SelectContent>
                 {MOCK_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           )
        }
      },
      {
        header: 'PROJECT / TAG',
        id: 'project',
        cell: ({ row }) => {
           const id = row.original.id;
           const value = editedData[id]?.projectId || row.original.projectId || '';
           return (
             <Select value={value} onValueChange={(val) => handleEdit(id, 'projectId', val)}>
               <SelectTrigger className="w-[140px] h-8 text-xs border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                 <SelectValue placeholder="Project..." />
               </SelectTrigger>
               <SelectContent>
                 {projectOptions.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           )
        }
      },
      {
        header: 'AMOUNT',
        accessorKey: 'amount',
        cell: ({ row }) => {
           const amount = row.getValue('amount') as number;
           const type = row.getValue('type') as string;
           const isIncome = type === 'INCOME';
           return (
             <div className="text-right pr-4">
               <span className={`font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                  {isIncome ? '+' : '-'}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
               </span>
             </div>
           )
        }
      }
    ],
    [projectOptions, editedData]
  );

  const filteredData = useMemo(() => {
    if (typeFilter === 'All') return transactions;
    return transactions.filter(t => t.type === typeFilter);
  }, [transactions, typeFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  // Effect to notify parent of selection changes
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection)
      .filter(k => rowSelection[k])
      .map(k => table.getRowModel().rowsById[k]?.original.id)
      .filter(Boolean); // Filter undefined just in case
      
    onSelectionChange(selectedIds);
  }, [rowSelection, onSelectionChange, table]);

  return (
    <div className="space-y-4">
      {/* Filters and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground mr-1">Quick Select:</span>
          <Button variant="outline" size="sm" onClick={() => table.toggleAllPageRowsSelected(true)} className="rounded-full h-8 text-xs font-semibold">Select All</Button>
          <Button variant="outline" size="sm" onClick={() => {
             const newSelection: Record<string, boolean> = {};
             table.getRowModel().rows.forEach(row => {
               if (row.original.type === 'INCOME') newSelection[row.id] = true;
             });
             setRowSelection(newSelection);
          }} className="rounded-full h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border-emerald-200">All Income</Button>
          <Button variant="outline" size="sm" onClick={() => {
             const newSelection: Record<string, boolean> = {};
             table.getRowModel().rows.forEach(row => {
               if (row.original.type === 'EXPENSE') newSelection[row.id] = true;
             });
             setRowSelection(newSelection);
          }} className="rounded-full h-8 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border-rose-200">All Expenses</Button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9 bg-card">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="All">All Types</SelectItem>
               <SelectItem value="INCOME">Income</SelectItem>
               <SelectItem value="EXPENSE">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/80 rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/60">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`text-xs font-bold text-muted-foreground uppercase tracking-wider h-11 ${header.id === 'amount' ? 'text-right pr-4' : ''}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 border-border/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No transactions found matching criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

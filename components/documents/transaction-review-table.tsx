'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  RowSelectionState
} from '@tanstack/react-table';
import { ExtractedTransaction, SelectedTransaction } from '@/lib/api/service/document-service';
import { useProjectOptions } from '@/lib/query/use-projects';
import { useGoalOptions } from '@/lib/query/use-goals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, Check } from 'lucide-react';

const MOCK_CATEGORIES = [
  'Salary', 'Freelance', 'Software', 'Hardware', 'Travel', 'Meals', 'Office Supplies', 'Marketing'
];

interface TransactionReviewTableProps {
  transactions: ExtractedTransaction[];
  onSubmit: (selectedData: SelectedTransaction[]) => void;
  isSubmitting?: boolean;
}

export function TransactionReviewTable({ transactions, onSubmit, isSubmitting }: TransactionReviewTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [editedData, setEditedData] = useState<Record<string, Partial<SelectedTransaction>>>({});
  
  const { data: projectOptions = [] } = useProjectOptions();
  const { data: goalOptions = [] } = useGoalOptions();

  const handleEdit = (id: string, field: keyof SelectedTransaction, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value === 'none' ? null : value
      }
    }));
  };

  const columns = useMemo<ColumnDef<ExtractedTransaction>[]>(
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
        accessorKey: 'direction',
        cell: ({ row }) => {
          const type = row.getValue('direction') as string;
          return type === 'CREDIT' ? (
            <ArrowUpCircle className="w-5 h-5 text-emerald-500" title="Credit / Income" />
          ) : (
             <ArrowDownCircle className="w-5 h-5 text-rose-500" title="Debit / Expense" />
          )
        }
      },
      {
        header: 'DATE',
        accessorKey: 'txnDate',
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue('txnDate')}</span>
      },
      {
        header: 'DESCRIPTION',
        accessorKey: 'description',
        cell: ({ row }) => (
           <div className="font-bold text-sm max-w-[200px] truncate" title={row.getValue('description')}>
             {row.getValue('description')}
           </div>
        )
      },
      {
        header: 'CATEGORY',
        id: 'category',
        cell: ({ row }) => {
           const id = row.original.id;
           const value = editedData[id]?.category || '';
           return (
             <Select value={value} onValueChange={(val) => handleEdit(id, 'category', val)}>
               <SelectTrigger className="w-[120px] h-8 text-xs border-0 bg-muted/30">
                 <SelectValue placeholder="Category..." />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="none">None</SelectItem>
                 {MOCK_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           )
        }
      },
      {
        header: 'PROJECT',
        id: 'project',
        cell: ({ row }) => {
           const id = row.original.id;
           const value = editedData[id]?.projectId || '';
           return (
             <Select value={value} onValueChange={(val) => handleEdit(id, 'projectId', val)}>
               <SelectTrigger className="w-[120px] h-8 text-xs border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                 <SelectValue placeholder="Project..." />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="none">None</SelectItem>
                 {projectOptions.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           )
        }
      },
      {
        header: 'GOAL',
        id: 'goal',
        cell: ({ row }) => {
           const id = row.original.id;
           const value = editedData[id]?.goalId || '';
           return (
             <Select value={value} onValueChange={(val) => handleEdit(id, 'goalId', val)}>
               <SelectTrigger className="w-[120px] h-8 text-xs border-0 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                 <SelectValue placeholder="Goal..." />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="none">None</SelectItem>
                 {goalOptions.map(g => (
                    <SelectItem key={g.id} value={g.id.toString()}>{g.title}</SelectItem>
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
           const type = row.getValue('direction') as string;
           const isIncome = type === 'CREDIT';
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
    [projectOptions, goalOptions, editedData]
  );

  const filteredData = useMemo(() => {
    if (typeFilter === 'All') return transactions;
    return transactions.filter(t => t.direction === typeFilter);
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

  const handleImportSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter(k => rowSelection[k]);
    if (selectedIds.length === 0) return;

    const selectedData: SelectedTransaction[] = selectedIds.map(rowId => {
      // rowId is the index in the filteredData array, we need the actual original.id
      const actualId = table.getRowModel().rowsById[rowId]?.original.id;
      if (!actualId) return null;
      
      const edits = editedData[actualId] || {};
      return {
        extractedTransactionId: actualId,
        goalId: edits.goalId || null,
        projectId: edits.projectId || null,
        category: edits.category || null,
      };
    }).filter(Boolean) as SelectedTransaction[];

    onSubmit(selectedData);
  };

  const selectedCount = Object.keys(rowSelection).filter(k => rowSelection[k]).length;

  return (
    <div className="space-y-4">
      {/* Filters and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground mr-1">Quick Select:</span>
          <Button variant="outline" size="sm" onClick={() => table.toggleAllPageRowsSelected(true)} className="rounded-full h-8 text-xs font-semibold">Select All</Button>
          <Button variant="outline" size="sm" onClick={() => {
             const newSelection: Record<string, boolean> = {};
             table.getRowModel().rows.forEach(row => {
               if (row.original.direction === 'CREDIT') newSelection[row.id] = true;
             });
             setRowSelection(newSelection);
          }} className="rounded-full h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border-emerald-200">All Credits</Button>
          <Button variant="outline" size="sm" onClick={() => {
             const newSelection: Record<string, boolean> = {};
             table.getRowModel().rows.forEach(row => {
               if (row.original.direction === 'DEBIT') newSelection[row.id] = true;
             });
             setRowSelection(newSelection);
          }} className="rounded-full h-8 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border-rose-200">All Debits</Button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9 bg-card">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="All">All Types</SelectItem>
               <SelectItem value="CREDIT">Credits</SelectItem>
               <SelectItem value="DEBIT">Debits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-3 px-4 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-sm font-semibold text-primary">{selectedCount} transactions selected</span>
          <Button onClick={handleImportSelected} disabled={isSubmitting} size="sm">
            {isSubmitting ? 'Importing...' : 'Import Selected'} <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border border-border/80 rounded-xl bg-card overflow-hidden shadow-sm overflow-x-auto">
        <Table className="min-w-[800px]">
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
                    <TableCell key={cell.id} className="py-3">
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

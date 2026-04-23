'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Transaction } from '@/lib/api/service/finance-service';
import { useCreateTransaction, useUpdateTransaction } from '@/lib/query/use-finance';
import { useProjectOptions } from '@/lib/query/use-projects';
import { useGoalOptions } from '@/lib/query/use-goals';
import { getErrorMessage, isValidationError } from '@/lib/hooks/use-api-error';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Schema ───────────────────────────────────────────────────────────────────
// Mirrors FinanceTransactionRequest exactly.

const schema = z.object({
  amount: z.coerce.number().nonnegative('Amount must be zero or positive'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Date is required'),   // sent as YYYY-MM-DD
  account: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  goalId: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Category presets (free-form on backend, suggested on UI) ─────────────────

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Rental Income', 'Interest', 'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment',
  'Health', 'Projects', 'Insurance', 'Education', 'Other Expense',
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransactionFormProps {
  transactionData?: Transaction | null;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransactionForm({ transactionData, onSuccess, onCancel }: TransactionFormProps) {
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const { data: projectOptions } = useProjectOptions();
  const { data: goalOptions } = useGoalOptions();

  const isEdit = !!transactionData;

  // Default date → today, formatted for date input
  const todayLocal = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      amount: transactionData?.amount ?? 0,
      description: transactionData?.description ?? '',
      category: transactionData?.category ?? '',
      type: transactionData?.type ?? 'EXPENSE',
      date: transactionData?.date ? transactionData.date.slice(0, 10) : todayLocal,
      account: transactionData?.account ?? '',
      projectId: transactionData?.projectId ?? null,
      goalId: transactionData?.goalId ?? null,
    },
  });

  const selectedType = form.watch('type');
  const categoryPresets = selectedType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      date: values.date,
      projectId: values.projectId === 'none' || !values.projectId ? null : values.projectId,
      goalId: values.goalId === 'none' || !values.goalId ? null : values.goalId,
      account: values.account || null,
    };

    try {
      if (isEdit && transactionData) {
        const updated = await updateMutation.mutateAsync({ id: transactionData.id, input: payload });
        onSuccess?.(updated);
      } else {
        const created = await createMutation.mutateAsync(payload);
        onSuccess?.(created);
      }
    } catch (err) {
      if (isValidationError(err)) {
        form.setError('root', { message: getErrorMessage(err, 'Validation failed.') });
      }
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* API-level validation error */}
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {form.formState.errors.root.message}
          </p>
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Monthly salary from ACME Corp" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type + Amount */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category — preset selector + free-type fallback */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {/* Quick-pick */}
                <Select
                  onValueChange={field.onChange}
                  value={categoryPresets.includes(field.value) ? field.value : ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Quick pick…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryPresets.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Free-type override */}
                <Input
                  placeholder="Or type a custom category"
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account + Project + Goal (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Chase Checking" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                  value={field.value ? String(field.value) : 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Link to project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projectOptions?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                  value={field.value ? String(field.value) : 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Link to goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {goalOptions?.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

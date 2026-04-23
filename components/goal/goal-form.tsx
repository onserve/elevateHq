'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Goal, GoalRequest } from '@/lib/api/service/goal-service';
import { useCreateGoal, useUpdateGoal } from '@/lib/query/use-goals';
import { useProjectOptions } from '@/lib/query/use-projects';
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

// 1. Define the Zod Schema based on your GoalRequest data structure
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['FINANCIAL', 'PERSONAL', 'BUSINESS', 'HEALTH', 'OTHER']),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED']),
  targetValue: z.coerce.number().optional(),
  currentValue: z.coerce.number().optional(),
  unit: z.string().optional(),
  deadline: z.string().optional(),
  projectId: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface GoalFormProps {
  goalData?: Goal | null; // complete data from getDetails
  onSuccess?: (goal: Goal) => void;
  onCancel?: () => void;
}

export function GoalForm({ goalData, onSuccess, onCancel }: GoalFormProps) {
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const { data: projectOptions } = useProjectOptions();

  const isEdit = !!goalData;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: goalData?.title ?? '',
      description: goalData?.description ?? '',
      category: goalData?.category ?? 'PERSONAL',
      status: goalData?.status ?? 'NOT_STARTED',
      targetValue: goalData?.targetValue ?? undefined,
      currentValue: goalData?.currentValue ?? undefined,
      unit: goalData?.unit ?? '',
      deadline: goalData?.deadline ?? '',
      projectId: goalData?.projectId ?? null,
    },
  });

  // 3. Handle Secure Submission via Server Actions
  async function onSubmit(values: FormValues) {
    try {
      if (isEdit && goalData) {
        const updated = await updateMutation.mutateAsync({
          goalId: goalData.id,
          input: values as GoalRequest,
        });
        onSuccess?.(updated);
      } else {
        const created = await createMutation.mutateAsync(values as GoalRequest);
        onSuccess?.(created);
      }
    } catch (err) {
      if (isValidationError(err)) {
        form.setError('root', { message: getErrorMessage(err, 'Validation failed.') });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* API-level validation error */}
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {form.formState.errors.root.message}
          </p>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Title</FormLabel>
              <FormControl>
                <Input placeholder="Increase revenue by 20%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['FINANCIAL', 'PERSONAL', 'BUSINESS', 'HEALTH', 'OTHER'].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link to Project</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                  value={field.value ? String(field.value) : 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None (Clear Selection)</SelectItem>

                    {/* Fallback item from goalData if it exists and is selected but not matching list */}
                    {goalData?.projectId &&
                      !projectOptions?.some(p => String(p.id) === String(goalData.projectId)) && (
                        <SelectItem value={String(goalData.projectId)}>
                          {goalData.projectName || 'Selected Project'}
                        </SelectItem>
                      )}

                    {projectOptions?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. KES, %" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Details about this objective..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {isEdit ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Goal, GoalRequest } from '@/lib/api/service/goal-service';
import { useCreateGoal, useUpdateGoal } from '@/lib/query/use-goals';
import { useProjectOptions } from '@/lib/query/use-projects';

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
  targetValue: z.coerce.number().optional(),
  unit: z.string().optional(),
  deadline: z.string().optional(),
  projectId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface GoalFormProps {
  initial?: Goal | null; // Null indicates "Create" mode
  onSuccess?: (goal: Goal) => void;
  onCancel?: () => void;
}

export function GoalForm({ initial, onSuccess, onCancel }: GoalFormProps) {
  const createMutation = useCreateGoal(); // [10]
  const updateMutation = useUpdateGoal(); // [11]
  const { data: projectOptions } = useProjectOptions(); // [12]

  const isEdit = !!initial;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      category: initial?.category ?? 'PERSONAL',
      targetValue: initial?.targetValue ?? 0,
      unit: initial?.unit ?? '',
      deadline: initial?.deadline ?? '',
      projectId: initial?.projectId ?? '',
    },
  });

  // 2. Sync form when initial data changes (Pattern from Source [8])
  useEffect(() => {
    if (initial) {
      form.reset({
        title: initial.title,
        description: initial.description,
        category: initial.category,
        targetValue: initial.targetValue,
        unit: initial.unit,
        deadline: initial.deadline,
        projectId: initial.projectId,
      });
    }
  }, [initial, form]);

  // 3. Handle Secure Submission via Server Actions
  async function onSubmit(values: FormValues) {
    if (isEdit && initial) {
      // Fix: Follow the Single Argument Rule from useUpdateGoal [11]
      const updated = await updateMutation.mutateAsync({
        goalId: initial.id,
        input: values as GoalRequest,
      });
      onSuccess?.(updated as any);
    } else {
      const created = await createMutation.mutateAsync(values as GoalRequest);
      onSuccess?.(created as any);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link to Project</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectOptions?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit (USD, Count, etc.)</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Details about this objective..." {...field} />
              </FormControl>
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

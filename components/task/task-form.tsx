'use client';

import { useEffect } from 'react';
import { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Task } from '@/lib/api/service/task-service';
import { useCreateTask, useUpdateTask } from '@/lib/query/use-tasks';
import { useProjectOptions} from '@/lib/query/use-projects';
import { useGoalOptions} from '@/lib/query/use-goals';


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

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
  goalId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  initial?: Task | null;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
}

export function TaskForm({ initial, onSuccess, onCancel }: TaskFormProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();


  const { data: projectOptions } = useProjectOptions();
  const { data: goalOptions } = useGoalOptions();

  const isEdit = !!initial;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      status: initial?.status ?? 'TODO',
      priority: initial?.priority ?? 'MEDIUM',
      dueDate: initial?.dueDate ?? '',
      projectId: initial?.projectId,
      goalId: initial?.goalId,
      tags: initial?.tags ?? [],
    },
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        title: initial.title,
        description: initial.description,
        status: initial.status,
        priority: initial.priority,
        dueDate: initial.dueDate,
        projectId: initial.projectId,
        goalId: initial.goalId,
        tags: initial.tags ?? [],
      });
    }
  }, [initial, form]);

  async function onSubmit(values: FormValues) {
    if (isEdit && initial) {
      const updated = await updateMutation.mutateAsync({
        id: initial.id,
        input: values,
      });
      onSuccess?.(updated);
    } else {
      const created = await createMutation.mutateAsync(values);
      onSuccess?.(created);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Install countertops" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional details..." {...field} />
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
              <FormLabel>Project</FormLabel>
              <Select
                // Logic: Map "none" back to undefined for the form state
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
                value={field.value || 'none'} // Default UI value to "none" if form is undefined
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Use "none" as a non-empty string value for the item */}
                  <SelectItem value="none">None (Clear Selection)</SelectItem>

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

        {/* Goal Selection (Optional) */}
        <FormField
          control={form.control}
          name="goalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Use "none" as a non-empty string value for the item */}
                  <SelectItem value="none">None (Clear Selection)</SelectItem>

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

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="frontend, urgent"
                  value={(field.value || []).join(', ')}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit">{isEdit ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Form>
  );
}

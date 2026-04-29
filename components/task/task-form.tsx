'use client';

import { useState, KeyboardEvent } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Task } from '@/lib/api/service/task-service';
import { useCreateTask, useUpdateTask } from '@/lib/query/use-tasks';
import { useProjectOptions } from '@/lib/query/use-projects';
import { useGoalOptions } from '@/lib/query/use-goals';
import { getErrorMessage, isValidationError } from '@/lib/hooks/use-api-error';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  projectId: z.string().nullable(),
  goalId: z.string().nullable(),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  taskData?: Task | null;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
}

export function TaskForm({ taskData, onSuccess, onCancel }: TaskFormProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const { data: projectOptions } = useProjectOptions();
  const { data: goalOptions } = useGoalOptions();

  const [tagInput, setTagInput] = useState('');

  const isEdit = !!taskData;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: taskData?.title ?? '',
      description: taskData?.description ?? '',
      status: taskData?.status ?? 'TODO',
      priority: taskData?.priority ?? 'MEDIUM',
      dueDate: taskData?.dueDate ?? '',
      projectId: taskData?.projectId ?? null,
      goalId: taskData?.goalId ?? null,
      tags: taskData?.tags ?? [],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit && taskData) {
        const updated = await updateMutation.mutateAsync({
          id: taskData.id,
          input: values,
        });
        onSuccess?.(updated);
      } else {
        const created = await createMutation.mutateAsync(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* API-level validation error */}
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {form.formState.errors.root.message}
          </p>
        )}
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
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                value={field.value ? String(field.value) : 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None (Clear Selection)</SelectItem>

                  {/* Fallback item if task's project is not in the options list */}
                  {taskData?.projectId &&
                    !projectOptions?.some(p => String(p.id) === String(taskData.projectId)) && (
                      <SelectItem value={String(taskData.projectId)}>
                        {taskData.projectName || 'Selected Project'}
                      </SelectItem>
                    )}

                  {projectOptions?.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
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
              <Select
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                value={field.value ? String(field.value) : 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None (Clear Selection)</SelectItem>

                  {/* Fallback item if task's goal is not in the options list */}
                  {taskData?.goalId &&
                    !goalOptions?.some(g => String(g.id) === String(taskData.goalId)) && (
                      <SelectItem value={String(taskData.goalId)}>
                        {taskData.goalName || 'Selected Goal'}
                      </SelectItem>
                    )}

                  {goalOptions?.map((goal) => (
                    <SelectItem key={goal.id} value={String(goal.id)}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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

                <Select onValueChange={field.onChange} value={field.value}>
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
          render={({ field }) => {
            const currentTags = field.value || [];

            const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const newTag = tagInput.trim();
                if (newTag && !currentTags.includes(newTag)) {
                  field.onChange([...currentTags, newTag]);
                }
                setTagInput('');
              } else if (e.key === 'Backspace' && tagInput === '' && currentTags.length > 0) {
                // Remove last tag on backspace if input is empty
                field.onChange(currentTags.slice(0, -1));
              }
            };

            const removeTag = (tagToRemove: string) => {
              field.onChange(currentTags.filter((tag) => tag !== tagToRemove));
            };

            return (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Input
                      placeholder="Type a tag and press Enter or Comma..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />

                    {currentTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-accent/10 hover:bg-accent/20 text-accent-foreground border-accent/20 pl-2.5 pr-1.5 py-1 text-sm flex items-center gap-1 transition-colors"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="focus:outline-none opacity-60 hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove {tag}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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

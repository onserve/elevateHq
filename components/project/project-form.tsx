'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Project, ProjectRequest } from '@/lib/api/service/project-service';
import { useCreateProject, useUpdateProject } from '@/lib/query/use-projects';
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

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.coerce.number().optional(),
  tags: z.string().optional(), // Handled as comma-separated string in UI
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm({
  initial,
  onSuccess,
  onCancel,
}: {
  initial?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      status: initial?.status ?? 'PLANNING',
      priority: initial?.priority ?? 'MEDIUM',
      startDate: initial?.startDate ?? '',
      endDate: initial?.endDate ?? '',
      budget: initial?.budget ?? 0,
      tags: initial?.tags?.join(', ') ?? '',
    },
  });

  useEffect(() => {
    if (initial) form.reset({ ...initial, tags: initial.tags?.join(', ') });
  }, [initial, form]);

  async function onSubmit(values: ProjectFormValues) {
    const formattedValues: ProjectRequest = {
      ...values,
      tags: values.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (initial) {
      // Wrapper pattern to avoid "missing body" errors [12, 13]
      await updateMutation.mutateAsync({
        projectId: initial.id.toString(),
        input: formattedValues,
      });
    } else {
      await createMutation.mutateAsync(formattedValues);
    }
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
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
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            Save Project
          </Button>
        </div>
      </form>
    </Form>
  );
}

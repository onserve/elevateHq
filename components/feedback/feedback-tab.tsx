"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFeedbacks, useSubmitFeedback, useToggleVote } from "@/lib/query/use-feedback";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackTab() {
  const { data, isLoading, isError } = useFeedbacks(0, 50);
  const submitMutation = useSubmitFeedback();
  const toggleVoteMutation = useToggleVote();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: FormValues) {
    submitMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const feedbacks = data?.content || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Short title..." disabled={submitMutation.isPending} {...field} />
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
                  <FormControl>
                    <Textarea 
                      placeholder="More details (optional)" 
                      className="resize-none h-20"
                      disabled={submitMutation.isPending}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Suggestion
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="text-center text-sm text-destructive py-4">
            Failed to load feedback.
          </div>
        )}

        {!isLoading && feedbacks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No suggestions yet. Be the first to share!
          </div>
        )}

        {feedbacks.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-colors",
                  item.hasVoted 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "text-muted-foreground hover:bg-secondary"
                )}
                onClick={() => toggleVoteMutation.mutate(item.id)}
                disabled={toggleVoteMutation.isPending && toggleVoteMutation.variables === item.id}
              >
                <ThumbsUp className={cn("h-5 w-5", item.hasVoted && "fill-current")} />
              </Button>
              <span className="text-xs font-semibold">{item.voteCount}</span>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm leading-tight">{item.title}</h4>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    item.status === "DONE" && "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
                    item.status === "PLANNED" && "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800",
                    item.status === "OPEN" && "bg-secondary text-secondary-foreground"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

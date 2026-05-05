"use client"

import { useReleaseNotes } from "@/lib/query/use-feedback";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

function formatDate(isoString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(isoString));
}

export function UpdatesTab() {
  const { data, isLoading, isError } = useReleaseNotes(0, 20);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        Failed to load updates. Please try again later.
      </div>
    );
  }

  const releaseNotes = data?.content || [];

  if (releaseNotes.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No updates yet. Check back later!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {releaseNotes.map((note) => (
        <div key={note.id} className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={note.type === "SHIPPED" ? "default" : "secondary"}
                className={note.type === "SHIPPED" ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600 text-white"}
              >
                {note.type === "SHIPPED" ? "✅ Shipped" : "🔜 Coming Soon"}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">{note.version}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(note.publishedAt || note.createdAt)}
            </span>
          </div>
          <h4 className="font-semibold">{note.title}</h4>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.body}</p>
        </div>
      ))}
    </div>
  );
}

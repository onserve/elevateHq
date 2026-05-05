"use client"

import { useState } from "react";
import { MessageSquarePlus, X, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackTab } from "./feedback-tab";
import { UpdatesTab } from "./updates-tab";

type TabType = "updates" | "feedback";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("updates");

  return (
    <>
      {/* Floating Action Button */}
      {/* Positioned beside the AI Assistant (which is right-8 bottom-8) */}
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-28 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40 bg-secondary text-secondary-foreground hidden lg:flex"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </Button>
      
      {/* Mobile Floating Action Button (Optional, if AI button doesn't take this space) */}
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40 bg-secondary text-secondary-foreground flex lg:hidden"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </Button>

      {/* Backdrop overlay for mobile (optional, mostly to click away) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-[100vw] sm:w-[400px] bg-background border-l shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            Feedback & Updates
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b bg-muted/20">
          <button
            onClick={() => setActiveTab("updates")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative",
              activeTab === "updates" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Megaphone className="h-4 w-4" />
            Updates
            {activeTab === "updates" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative",
              activeTab === "feedback" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquarePlus className="h-4 w-4" />
            Feedback
            {activeTab === "feedback" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "updates" ? <UpdatesTab /> : <FeedbackTab />}
        </div>
      </div>
    </>
  );
}

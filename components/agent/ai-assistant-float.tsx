'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiAssistantChat } from './ai-assistant-chat';

// A simple global event to trigger the chat from anywhere (e.g., mobile header)
export const OPEN_AI_ASSISTANT_EVENT = 'open-ai-assistant';

export function openAiAssistant() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_AI_ASSISTANT_EVENT));
  }
}

export function AiAssistantFloat() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_AI_ASSISTANT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_AI_ASSISTANT_EVENT, handleOpen);
  }, []);

  return (
    <>
      {/* Desktop Floating Button */}
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40 bg-primary text-primary-foreground"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* Chat Popover / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-end sm:items-end lg:bottom-28 lg:right-8 lg:top-auto lg:left-auto pointer-events-none lg:p-0 p-4">
          <div className="w-full lg:w-[400px] h-[80vh] lg:h-[600px] pointer-events-auto shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in-20">
            <AiAssistantChat onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export function AiAssistantMobileTrigger() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openAiAssistant}
      className="lg:hidden h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
    >
      <Sparkles className="h-5 w-5" />
    </Button>
  );
}

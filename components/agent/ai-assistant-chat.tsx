'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAgentChat } from '@/lib/query/use-agent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  confidence?: number;
  suggestions?: string[];
  isLoading?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  'How is my budget tracking?',
  'What are my spending patterns?',
  'Any recommendations for cost savings?',
];

interface AiAssistantChatProps {
  onClose: () => void;
}

export function AiAssistantChat({ onClose }: AiAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatMutation = useAgentChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    const tempId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: tempId,
      role: 'assistant',
      text: '',
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');

    chatMutation.mutate(
      { question: text.trim() },
      {
        onSuccess: (data) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    text: data.answer,
                    confidence: data.confidence,
                    suggestions: data.suggestions,
                    isLoading: false,
                  }
                : msg
            )
          );
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    text: 'Sorry, I encountered an error. Please try again.',
                    isLoading: false,
                  }
                : msg
            )
          );
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-card shadow-2xl sm:rounded-2xl sm:border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Ask me anything</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
                I can help you analyze spending, track progress, and provide insights based on your project data.
              </p>
            </div>
            <div className="flex flex-col w-full gap-2 mt-4">
              {DEFAULT_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="text-left text-sm px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-muted' : 'bg-primary/10'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-primary" />
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[80%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="px-4 py-3 rounded-2xl bg-muted/50 rounded-tl-sm flex gap-1 items-center h-[44px]">
                      <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted/50 text-foreground rounded-tl-sm whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.confidence && (
                    <div className="w-full mt-3 px-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Confidence:</span>
                        <span>{msg.confidence}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000 ease-out"
                          style={{ width: `${msg.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="w-full mt-4 px-1">
                      <p className="text-xs font-semibold mb-2">Suggestions:</p>
                      <ul className="space-y-1">
                        {msg.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span> {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="pr-12 h-12 rounded-xl bg-muted/30 border-border"
            disabled={chatMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || chatMutation.isPending}
            className="absolute right-1.5 h-9 w-9 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

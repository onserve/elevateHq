'use server';

import { serverApi } from '@/lib/api/server-api-client';

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  confidence?: number;
  suggestions?: string[];
}

export async function sendAgentMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await serverApi.post<any>('/agent/chat', request);
  // Unwrapped globally, but just in case fallback is returned
  return response.data?.data || response.data;
}

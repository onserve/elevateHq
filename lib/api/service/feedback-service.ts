"use server"

import { PaginatedResponse } from '@/lib/api/server-api-client';
import { serverApi } from '@/lib/api/server-api-client';

export interface FeedbackItem {
  id: string;
  title: string;
  description: string | null;
  status: "OPEN" | "PLANNED" | "DONE";
  voteCount: number;
  hasVoted: boolean;
  createdAt: string;
}

export interface VoteResponse {
  feedbackId: string;
  voteCount: number;
  hasVoted: boolean;
}

export interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  body: string;
  type: "COMING_SOON" | "SHIPPED";
  publishedAt: string;
  createdAt: string;
}

export interface FeedbackSubmitRequest {
  title: string;
  description?: string;
}

export async function submitFeedback(input: FeedbackSubmitRequest): Promise<string> {
  const response = await serverApi.post<string>("/feedback", input);
  return response.data;
}

export async function getFeedbacks(page: number = 0, size: number = 50): Promise<PaginatedResponse<FeedbackItem>> {
  const response = await serverApi.get<PaginatedResponse<FeedbackItem>>(`/feedback?page=${page}&size=${size}`);
  return response.data;
}

export async function toggleVote(id: string): Promise<VoteResponse> {
  const response = await serverApi.post<VoteResponse>(`/feedback/${id}/vote`);
  return response.data;
}

export async function getReleaseNotes(page: number = 0, size: number = 20): Promise<PaginatedResponse<ReleaseNote>> {
  const response = await serverApi.get<PaginatedResponse<ReleaseNote>>(`/feedback/release-note?page=${page}&size=${size}`);
  return response.data;
}

// lib/api/server-api-client.ts
import { auth, signOut} from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error'; // ✅ Next.js utility


export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

/**
 * Server-side API Client
 *
 * This client runs ONLY on the server, ensuring tokens never reach the client.
 *
 * Features:
 * - Automatic token injection from NextAuth session
 * - Retry logic with exponential backoff
 * - Request timeout handling
 * - Comprehensive error handling
 * - Request ID generation for tracing
 *
 * Usage:
 * ```typescript
 * const tasks = await serverApi.get<Task[]>("/tasks")
 * const newTask = await serverApi.post<Task>("/tasks", { title: "New Task" })
 * ```
 */
export class ServerApiClient {
  private baseUrl: string;
  private defaultTimeout = 30000; // 30 seconds
  private maxRetries = 3;

  constructor(baseUrl?: string) {
    // Use internal URL for server-to-server communication
    // This should be the internal docker network URL in production
    this.baseUrl = baseUrl || process.env.API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  /**
   * Build request headers with authentication
   *
   * Flow:
   * 1. Get session from NextAuth (server-side)
   * 2. Extract access token
   * 3. Add to Authorization header
   * 4. Add standard headers (Content-Type, Request-ID)
   */
  private async buildHeaders(config?: RequestConfig): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    // Generate unique request ID for tracing
    if (!headers['X-Request-Id']) {
      headers['X-Request-Id'] =
        `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }

    // Skip auth if explicitly requested (for public endpoints)
    if (config?.skipAuth) {
      return headers;
    }

    // Get token from NextAuth session (server-side)
    const session = await auth();

    if (!session?.accessToken) {
      redirect("/")
    }

    // Add Bearer token to Authorization header
    headers['Authorization'] = `Bearer ${session.accessToken}`;

    return headers;
  }

  /**
   * Handle API response and errors
   *
   * Parses response and throws typed ApiError on failure
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    // Handle error responses
    if (!response.ok) {

      if (response.status === 401) {
        console.log('[API Client] 401 from backend, redirecting to signout');
        redirect('/api/auth/signout?callbackUrl=/'); // ✅ same here
      }

      const errorMessage =
        data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError(response.status, errorMessage, data?.code, data);
    }

    return {
      data,
      status: response.status,
      message: data?.message,
    };
  }

  /**
   * Make HTTP request with retry logic
   *
   * Features:
   * - Automatic retries on network/server errors
   * - Exponential backoff (1s, 2s, 4s)
   * - Timeout handling with AbortController
   * - Skip retries for client errors (4xx)
   *
   * Flow:
   * 1. Attempt request
   * 2. If 5xx or network error → retry with backoff
   * 3. If 4xx → fail immediately (don't retry)
   * 4. If timeout → abort and retry
   */
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    body?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const retries = config?.retries ?? this.maxRetries;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const headers = await this.buildHeaders(config);

        const requestConfig: RequestInit = {
          method,
          headers,
          // Note: No 'credentials: include' needed for server-to-server calls
        };

        // Add body for non-GET requests
        if (body && method !== 'GET') {
          requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        // Set up timeout with AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          config?.timeout ?? this.defaultTimeout,
        );

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return await this.handleResponse<T>(response);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        // Don't retry on client errors (4xx) or auth errors
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Last attempt - throw error
        if (attempt === retries) {
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError(
            0,
            `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }

        // Wait before retry (exponential backoff: 1s, 2s, 4s)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new ApiError(0, 'Max retries exceeded');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, body, config);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, body, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PATCH', endpoint, body, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  }
}

/**
 * Export singleton instance
 *
 * Usage:
 * ```typescript
 * import { serverApi } from "@/lib/api/server-api-client"
 *
 * const tasks = await serverApi.get<Task[]>("/tasks")
 * ```
 */
export const serverApi = new ServerApiClient();

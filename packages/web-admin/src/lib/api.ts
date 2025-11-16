'use client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Get token from Stack Auth (stored in cookies, will be sent automatically)
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for auth
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'API request failed',
    }));
    throw new Error(error.error || error.message || 'API request failed');
  }

  return response.json();
}

// Helper functions for common HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),

  post: <T = unknown>(endpoint: string, data?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T = unknown>(endpoint: string, data?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T = unknown>(endpoint: string) =>
    apiCall<T>(endpoint, { method: 'DELETE' }),
};

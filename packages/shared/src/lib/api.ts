import type { ApiResponse, QueryParams } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Build URL with query parameters
 */
function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Type-safe fetch wrapper with error handling
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { params?: QueryParams } = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(path, params);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    const data = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: 'REQUEST_FAILED',
          message: `Request failed with status ${response.status}`,
        },
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
}

/**
 * GET request helper
 */
export function apiGet<T>(path: string, params?: QueryParams) {
  return apiFetch<T>(path, { method: 'GET', params });
}

/**
 * POST request helper
 */
export function apiPost<T>(path: string, body: unknown, params?: QueryParams) {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    params,
  });
}

/**
 * PUT request helper
 */
export function apiPut<T>(path: string, body: unknown, params?: QueryParams) {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    params,
  });
}

/**
 * DELETE request helper
 */
export function apiDelete<T>(path: string, params?: QueryParams) {
  return apiFetch<T>(path, { method: 'DELETE', params });
}

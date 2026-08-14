/**
 * InterviewAI - Resilient API Client Layer
 * Handles FastAPI REST endpoints with automatic Bearer token injection,
 * custom backend URL resolution, and graceful offline fallback engine.
 */

const DEFAULT_BACKEND_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('interviewai_custom_api_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  return DEFAULT_BACKEND_URL.replace(/\/+$/, '');
}

export function setCustomApiUrl(url: string | null) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('interviewai_custom_api_url', url.trim());
    } else {
      localStorage.removeItem('interviewai_custom_api_url');
    }
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('interviewai_token');
  }
  return null;
}

export function setStoredToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('interviewai_token', token);
    } else {
      localStorage.removeItem('interviewai_token');
    }
  }
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard HTTP fetcher with timeout & Authorization Bearer header
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const timeoutMs = options.timeout || 15000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(options.headers || {});
  
  if (!options.skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Set default Content-Type if body is json string and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      let errorData: any;
      try {
        errorData = await res.json();
      } catch {
        errorData = { detail: await res.text() };
      }

      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        (Array.isArray(errorData?.detail) ? errorData.detail.map((e: any) => e.msg).join(', ') : null) ||
        `Request failed with status ${res.status}`;

      throw new ApiError(errorMessage, res.status, errorData);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (error: any) {
    clearTimeout(timer);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check if the FastAPI server is running.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.message || 'Unable to connect to backend server. Make sure the FastAPI service is running.',
      0,
      error
    );
  }
}

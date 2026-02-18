import type {
  Service,
  Article,
  ArticlesResponse,
  Testimonial,
  Client,
  GalleryResponse,
  ContactFormData,
  ContactResponse,
  ApiError,
} from './types';

// API base URL — changes between dev and production
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestOptions = {},
  retries: number = 2
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!res.ok) {
        const errorData: ApiError = await res.json().catch(() => ({ error: 'Unknown error' }));
        lastError = new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
        lastError.name = errorData.error;
        throw lastError;
      }

      return await res.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on 4xx errors (client errors)
      if (lastError.message.includes('HTTP 4')) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError;
}

// Typed API methods
export const api = {
  getServices: (): Promise<Service[]> =>
    fetchAPI<Service[]>('/api/services'),

  getService: (slug: string): Promise<Service> =>
    fetchAPI<Service>(`/api/services/${slug}`),

  getTestimonials: (): Promise<Testimonial[]> =>
    fetchAPI<Testimonial[]>('/api/testimonials'),

  getClients: (): Promise<Client[]> =>
    fetchAPI<Client[]>('/api/clients'),

  getArticles: (page = 1, category?: string): Promise<ArticlesResponse> => {
    let url = `/api/articles?page=${page}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return fetchAPI<ArticlesResponse>(url);
  },

  getArticle: (slug: string): Promise<Article> =>
    fetchAPI<Article>(`/api/articles/${slug}`),

  getGallery: (category?: string): Promise<GalleryResponse> => {
    let url = '/api/gallery';
    if (category && category !== 'all') {
      url += `?category=${encodeURIComponent(category)}`;
    }
    return fetchAPI<GalleryResponse>(url);
  },

  submitContact: (data: ContactFormData): Promise<ContactResponse> =>
    fetchAPI<ContactResponse>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

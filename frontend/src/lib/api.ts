// API base URL — changes between dev and production
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// Typed API methods
export const api = {
    getServices: () => fetchAPI<any[]>('/api/services'),
    getService: (slug: string) => fetchAPI<any>(`/api/services/${slug}`),
    getTestimonials: () => fetchAPI<any[]>('/api/testimonials'),
    getClients: () => fetchAPI<any[]>('/api/clients'),
    getArticles: (page = 1, category?: string) => {
        let url = `/api/articles?page=${page}`;
        if (category) url += `&category=${category}`;
        return fetchAPI<{ articles: any[]; pagination: any }>(url);
    },
    getArticle: (slug: string) => fetchAPI<any>(`/api/articles/${slug}`),
    getGallery: (category?: string) => {
        let url = '/api/gallery';
        if (category) url += `?category=${category}`;
        return fetchAPI<{ items: any[]; categories: string[] }>(url);
    },
    submitContact: (data: any) => fetchAPI<any>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

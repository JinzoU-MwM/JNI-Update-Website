/**
 * Admin API utility for authenticated requests to the backend.
 * All admin pages should use this instead of direct fetch calls.
 */

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api/admin';

function getAuthHeaders(): Record<string, string> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE}${endpoint}`;
    const headers = { ...getAuthHeaders(), ...(options.headers as Record<string, string> || {}) };

    const response = await fetch(url, {
        ...options,
        headers
    });

    // If 401, redirect to login
    if (response.status === 401) {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('admin_token');
        }
        if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
        }
        throw new Error('Session expired. Please log in again.');
    }

    return response;
}

export async function adminGet(endpoint: string): Promise<Response> {
    return adminFetch(endpoint, { method: 'GET' });
}

export async function adminPost(endpoint: string, body: unknown): Promise<Response> {
    return adminFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}

export async function adminUploadFile(file: File, folder: string = 'uploads'): Promise<{ success: boolean; path: string }> {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const response = await adminPost('/upload', { file: base64, folder });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Upload failed');
    }
    return response.json();
}

export async function adminPut(endpoint: string, body: unknown): Promise<Response> {
    return adminFetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
    });
}

export async function adminDelete(endpoint: string): Promise<Response> {
    return adminFetch(endpoint, { method: 'DELETE' });
}

export { API_BASE };

import { fetchAPI } from '$lib/api';

export async function load() {
    try {
        const [services, testimonials, clients] = await Promise.all([
            fetchAPI('/api/services'),
            fetchAPI('/api/testimonials'),
            fetchAPI('/api/clients'),
        ]);
        return { services, testimonials, clients };
    } catch (error) {
        console.error('Home page load error:', error);
        return { services: [], testimonials: [], clients: [] };
    }
}

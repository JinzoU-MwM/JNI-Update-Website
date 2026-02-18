import { fetchAPI } from '$lib/api';
import type { Service, Testimonial, Client } from '$lib/types';

export async function load() {
    try {
        const [services, testimonials, clients] = await Promise.all([
            fetchAPI<Service[]>('/api/services'),
            fetchAPI<Testimonial[]>('/api/testimonials'),
            fetchAPI<Client[]>('/api/clients'),
        ]);
        return { services, testimonials, clients };
    } catch (error) {
        console.error('Home page load error:', error);
        // Don't silently fail - return error state
        return {
            services: [],
            testimonials: [],
            clients: [],
            error: error instanceof Error ? error.message : 'Failed to load data'
        };
    }
}

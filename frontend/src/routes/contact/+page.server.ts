import { fetchAPI } from '$lib/api';

export async function load() {
    try {
        const services = await fetchAPI('/api/services');
        return { services };
    } catch (_error) {
        return { services: [] };
    }
}

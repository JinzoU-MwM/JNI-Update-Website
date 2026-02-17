import { fetchAPI } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const service = await fetchAPI(`/api/services/${params.slug}`);
        return { service };
    } catch (err) {
        throw error(404, 'Layanan tidak ditemukan');
    }
}

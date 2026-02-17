import { fetchAPI } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const article = await fetchAPI(`/api/articles/${params.slug}`);
        return { article };
    } catch (err) {
        throw error(404, 'Artikel tidak ditemukan');
    }
}

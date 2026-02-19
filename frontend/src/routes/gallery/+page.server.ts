import { fetchAPI } from '$lib/api';

export async function load({ url }) {
    try {
        const category = url.searchParams.get('category') || undefined;
        const data = await fetchAPI(`/api/gallery${category ? `?category=${category}` : ''}`);
        return { ...data, currentCategory: category || 'all' };
    } catch (_error) {
        return { items: [], categories: [], currentCategory: 'all' };
    }
}

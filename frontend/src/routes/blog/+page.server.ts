import { fetchAPI } from '$lib/api';

export async function load({ url }) {
    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const category = url.searchParams.get('category') || undefined;
        const data = await fetchAPI(`/api/articles?page=${page}${category ? `&category=${category}` : ''}`);
        return { ...data, currentCategory: category || 'all' };
    } catch (_error) {
        return { articles: [], pagination: { page: 1, total: 0, totalPages: 0 }, currentCategory: 'all' };
    }
}

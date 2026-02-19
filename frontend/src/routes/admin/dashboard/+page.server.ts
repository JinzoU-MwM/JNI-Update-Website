import { fetchAPI } from '$lib/api';

export async function load() {
  // Auth is handled client-side by the layout
  // This just fetches stats data
  try {
    const [services, articles, testimonials, clients] = await Promise.all([
      fetchAPI('/api/services'),
      fetchAPI('/api/articles?page=1&limit=1'),
      fetchAPI('/api/testimonials'),
      fetchAPI('/api/clients')
    ]);

    return {
      stats: {
        services: services.length,
        articles: articles.pagination?.total || 0,
        testimonials: testimonials.length,
        clients: clients.length
      }
    };
  } catch (_error) {
    return {
      stats: {
        services: 0,
        articles: 0,
        testimonials: 0,
        clients: 0
      },
      error: 'Failed to load statistics'
    };
  }
}

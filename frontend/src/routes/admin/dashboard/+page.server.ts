import { fetchAPI } from '$lib/api';

export async function load({ locals }) {
  // Check if user is authenticated (simplified check)
  const token = locals.cookies?.get('admin_token');

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    // Fetch statistics from public API (would be better with admin-specific endpoints)
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
  } catch (error) {
    return {
      stats: {
        services: 0,
        articles: 0,
        testimonials: 0,
        clients: 0
      },
      error: error instanceof Error ? error.message : 'Failed to load statistics'
    };
  }
}

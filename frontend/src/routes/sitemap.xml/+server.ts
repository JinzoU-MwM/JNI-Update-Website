import type { RequestHandler } from './$types';

const BASE_URL = 'https://jamnasindo.id';

// Static pages
const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  { loc: '/services', changefreq: 'weekly', priority: 0.9 },
  { loc: '/blog', changefreq: 'daily', priority: 0.8 },
  { loc: '/gallery', changefreq: 'weekly', priority: 0.6 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 }
];

function generateSiteMap(
  services: { slug: string; updated_at?: string }[],
  articles: { slug: string; updated_at?: string }[]
): string {
  const now = new Date().toISOString();

  const urls = [
    // Static pages
    ...staticPages.map((page) => ({
      loc: `${BASE_URL}${page.loc}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority
    })),
    // Service pages
    ...services.map((service) => ({
      loc: `${BASE_URL}/services/${service.slug}`,
      lastmod: service.updated_at || now,
      changefreq: 'monthly',
      priority: 0.8
    })),
    // Blog articles
    ...articles.map((article) => ({
      loc: `${BASE_URL}/blog/${article.slug}`,
      lastmod: article.updated_at || now,
      changefreq: 'monthly',
      priority: 0.7
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    // Fetch services and articles from API
    const [servicesRes, articlesRes] = await Promise.all([
      fetch('https://backend-nine-dun-99.vercel.app/api/services'),
      fetch('https://backend-nine-dun-99.vercel.app/api/articles')
    ]);

    const servicesData = servicesRes.ok ? await servicesRes.json() : { services: [] };
    const articlesData = articlesRes.ok ? await articlesRes.json() : { articles: [] };

    const services = servicesData.services || servicesData || [];
    const articles = articlesData.articles || articlesData || [];

    const sitemap = generateSiteMap(services, articles);

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    // Return basic sitemap if API fails
    const basicSitemap = generateSiteMap([], []);
    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600'
      }
    });
  }
};

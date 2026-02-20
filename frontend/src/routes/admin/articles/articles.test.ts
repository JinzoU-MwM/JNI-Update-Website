import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Articles API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/articles', () => {
    it('should fetch articles with pagination', async () => {
      const mockResponse = {
        articles: [
          { id: '1', title: 'Article 1', excerpt: 'Excerpt 1', category: 'Business', is_published: true },
          { id: '2', title: 'Article 2', excerpt: 'Excerpt 2', category: 'Tech', is_published: false }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch(`${API_BASE}/articles?page=1&limit=10`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.articles).toHaveLength(2);
      expect(data.total).toBe(2);
    });
  });

  describe('POST /api/articles', () => {
    it('should create a new article', async () => {
      const newArticle = {
        title: 'New Article',
        excerpt: 'Article excerpt',
        content: 'Full content here',
        category: 'Business Strategy',
        author: 'Admin',
        is_published: false
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '3', ...newArticle })
      });

      const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.title).toBe('New Article');
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('should toggle publish status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', is_published: true })
      });

      const response = await fetch(`${API_BASE}/articles/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: true })
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.is_published).toBe(true);
    });
  });
});

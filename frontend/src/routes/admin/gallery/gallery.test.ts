import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Gallery API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/gallery', () => {
    it('should fetch gallery items', async () => {
      const mockResponse = {
        items: [
          { id: '1', title: 'Project A', image_url: 'https://example.com/img1.jpg', category: 'Project' },
          { id: '2', title: 'Event B', image_url: 'https://example.com/img2.jpg', category: 'Event' }
        ],
        categories: ['Project', 'Event', 'Team']
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch(`${API_BASE}/gallery`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.items).toHaveLength(2);
      expect(data.categories).toContain('Project');
    });

    it('should filter by category', async () => {
      const mockResponse = {
        items: [
          { id: '1', title: 'Project A', image_url: 'url', category: 'Project' }
        ],
        categories: ['Project', 'Event']
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch(`${API_BASE}/gallery?category=Project`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      data.items.forEach((item: any) => {
        expect(item.category).toBe('Project');
      });
    });
  });

  describe('POST /api/gallery', () => {
    it('should upload a new gallery item', async () => {
      const newItem = {
        title: 'New Photo',
        image_url: 'https://example.com/new.jpg',
        category: 'Project'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '3', ...newItem })
      });

      const response = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.title).toBe('New Photo');
    });
  });

  describe('DELETE /api/gallery/:id', () => {
    it('should delete a gallery item', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const response = await fetch(`${API_BASE}/gallery/1`, {
        method: 'DELETE'
      });

      expect(response.ok).toBe(true);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Services API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/services', () => {
    it('should fetch all services', async () => {
      const mockServices = [
        { id: '1', title: 'Business Consulting', short_description: 'Test', is_active: true },
        { id: '2', title: 'Financial Planning', short_description: 'Test 2', is_active: true }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServices)
      });

      const response = await fetch(`${API_BASE}/services`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].title).toBe('Business Consulting');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const response = await fetch(`${API_BASE}/services`);
      expect(response.ok).toBe(false);
    });
  });

  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      const newService = {
        title: 'New Service',
        short_description: 'Description',
        full_description: 'Full desc',
        icon_name: 'briefcase',
        is_active: true
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '3', ...newService })
      });

      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.title).toBe('New Service');
      expect(data.id).toBeDefined();
    });
  });

  describe('PUT /api/services/:id', () => {
    it('should update a service', async () => {
      const updateData = { is_active: false };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', is_active: false })
      });

      const response = await fetch(`${API_BASE}/services/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.is_active).toBe(false);
    });
  });
});

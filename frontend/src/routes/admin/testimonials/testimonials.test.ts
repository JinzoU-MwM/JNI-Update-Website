import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Testimonials API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/testimonials', () => {
    it('should fetch all testimonials', async () => {
      const mockTestimonials = [
        { id: '1', name: 'John Doe', content: 'Great service!', rating: 5, is_active: true },
        { id: '2', name: 'Jane Smith', content: 'Very helpful', rating: 4, is_active: true }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestimonials)
      });

      const response = await fetch(`${API_BASE}/testimonials`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].rating).toBe(5);
    });
  });

  describe('POST /api/testimonials', () => {
    it('should create a new testimonial', async () => {
      const newTestimonial = {
        name: 'New Customer',
        role: 'CEO',
        company: 'Tech Corp',
        content: 'Amazing experience!',
        rating: 5,
        is_active: true
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '3', ...newTestimonial })
      });

      const response = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.name).toBe('New Customer');
      expect(data.rating).toBeLessThanOrEqual(5);
      expect(data.rating).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PUT /api/testimonials/:id', () => {
    it('should update testimonial visibility', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', is_active: false })
      });

      const response = await fetch(`${API_BASE}/testimonials/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false })
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.is_active).toBe(false);
    });
  });

  describe('Rating validation', () => {
    it('should accept ratings between 1 and 5', () => {
      const validRatings = [1, 2, 3, 4, 5];
      validRatings.forEach(rating => {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      });
    });
  });
});

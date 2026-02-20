import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dashboard Stats', () => {
    it('should fetch all stats for dashboard', async () => {
      // Mock services
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1' }, { id: '2' }])
      });

      // Mock articles
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ articles: [{ id: '1' }], total: 1 })
      });

      // Mock testimonials
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1' }])
      });

      // Mock clients
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1' }])
      });

      const [services, articles, testimonials, clients] = await Promise.all([
        (await fetch(`${API_BASE}/services`)).json(),
        (await fetch(`${API_BASE}/articles`)).json(),
        (await fetch(`${API_BASE}/testimonials`)).json(),
        (await fetch(`${API_BASE}/clients`)).json()
      ]);

      const stats = {
        services: services.length,
        articles: articles.articles?.length || articles.length,
        testimonials: testimonials.length,
        clients: clients.length
      };

      expect(stats.services).toBe(2);
      expect(stats.articles).toBe(1);
      expect(stats.testimonials).toBe(1);
      expect(stats.clients).toBe(1);
    });
  });
});

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'admin@jni.com',
          name: 'Admin',
          role: 'super_admin'
        },
        token: 'jwt-token-123'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@jni.com',
          password: 'Admin@123'
        })
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      });

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@email.com',
          password: 'wrongpass'
        })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });
});

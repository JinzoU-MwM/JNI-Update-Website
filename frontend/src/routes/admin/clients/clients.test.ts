import { describe, it, expect, beforeEach, vi } from 'vitest';

const API_BASE = 'https://backend-nine-dun-99.vercel.app/api';

describe('Clients API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/clients', () => {
    it('should fetch all clients', async () => {
      const mockClients = [
        { id: '1', name: 'Client A', logo_path: 'https://example.com/logo1.png', is_active: true },
        { id: '2', name: 'Client B', logo_path: 'https://example.com/logo2.png', is_active: true }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockClients)
      });

      const response = await fetch(`${API_BASE}/clients`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Client A');
    });
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      const newClient = {
        name: 'New Client',
        logo_path: 'https://example.com/newlogo.png',
        display_order: 1,
        is_active: true
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '3', ...newClient })
      });

      const response = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.name).toBe('New Client');
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should update client active status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', is_active: false })
      });

      const response = await fetch(`${API_BASE}/clients/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false })
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.is_active).toBe(false);
    });
  });
});

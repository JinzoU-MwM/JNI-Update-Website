import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock supabase before importing auth module
vi.mock('../src/config/db', () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock logger
vi.mock('../src/config/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import request from 'supertest';
import app from '../api/index.js';
import supabase from '../src/config/db.js';

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return 401 for invalid credentials (user not found)', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      supabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: mockSingle,
            })),
          })),
        })),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'UNAUTHORIZED');
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should return 400 if token is missing', async () => {
      const res = await request(app).post('/api/auth/verify').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return error for invalid token', async () => {
      const res = await request(app).post('/api/auth/verify').send({
        token: 'invalid-token',
      });

      expect(res.status).toBe(401);
    });
  });
});

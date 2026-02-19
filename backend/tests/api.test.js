import { describe, it, expect } from 'vitest';

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

describe('API Health Check', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/api');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('dbReady');
  });
});

describe('Error Handling', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'NOT_FOUND');
  });
});

describe('Security Headers', () => {
  it('should have security headers set', async () => {
    const res = await request(app).get('/api');

    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(res.headers).toHaveProperty('x-frame-options', 'DENY');
  });
});

describe('Rate Limiting', () => {
  it('should apply rate limiting to service routes', async () => {
    const res = await request(app).get('/api/services');

    // Rate limit headers should be present on rate-limited routes
    expect(res.headers).toHaveProperty('ratelimit-limit');
  });
});

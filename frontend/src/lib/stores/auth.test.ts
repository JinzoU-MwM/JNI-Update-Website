import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should have login function', async () => {
    const { auth } = await import('$lib/stores/auth');
    expect(auth.login).toBeDefined();
    expect(typeof auth.login).toBe('function');
  });

  it('should have logout function', async () => {
    const { auth } = await import('$lib/stores/auth');
    expect(auth.logout).toBeDefined();
    expect(typeof auth.logout).toBe('function');
  });

  it('should store user data after login', async () => {
    const { auth, user } = await import('$lib/stores/auth');

    const mockUser = {
      id: '1',
      email: 'admin@jni.com',
      name: 'Admin User',
      role: 'super_admin'
    };
    const mockToken = 'test-token-123';

    auth.login(mockUser, mockToken);

    let currentUser: any;
    const unsubscribe = user.subscribe(u => currentUser = u);

    expect(currentUser).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalled();

    unsubscribe();
  });

  it('should clear user data after logout', async () => {
    const { auth, user } = await import('$lib/stores/auth');

    // First login
    auth.login({ id: '1', email: 'test@test.com', name: 'Test', role: 'admin' }, 'token');

    // Then logout
    auth.logout();

    let currentUser: any;
    const unsubscribe = user.subscribe(u => currentUser = u);

    expect(currentUser).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalled();

    unsubscribe();
  });
});

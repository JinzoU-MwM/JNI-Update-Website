import { writable, derived } from 'svelte/store';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Create auth store with persistence
const createAuthStore = () => {
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!(storedUser && storedToken)
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    login: (user: User, token: string) => {
      const authState: AuthState = {
        user,
        token,
        isAuthenticated: true
      };

      set(authState);

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_token', token);
      }
    },

    logout: () => {
      const authState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false
      };

      set(authState);

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    },

    setUser: (user: User | null) => {
      update(state => ({
        ...state,
        user,
        isAuthenticated: !!user
      }));

      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('admin_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('admin_user');
        }
      }
    }
  };
};

export const auth = createAuthStore();

// Derived store for easy access
export const user = derived(auth, $auth => $auth.user);
export const token = derived(auth, $auth => $auth.token);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);

<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  interface FormData {
    email: string;
    password: string;
  }

  let form = $state<FormData>({
    email: '',
    password: ''
  });

  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      auth.login(data.user, data.token);

      // Redirect to dashboard
      goto('/admin/dashboard');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred during login';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Admin Dashboard</title>
  <meta name="description" content="Login to admin dashboard" />
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>Admin Login</h1>
      <p>Sign in to access the dashboard</p>
    </div>

    {#if error}
      <div class="alert alert-error">
        ❌ {error}
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={form.email}
          required
          placeholder="admin@jni.com"
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={form.password}
          required
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="btn btn-primary" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <div class="login-footer">
      <p>Forgot your password? Contact system administrator.</p>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-header h1 {
    color: var(--primary-dark);
    margin: 0 0 10px 0;
    font-size: var(--font-size-2xl);
  }

  .login-header p {
    color: var(--text-light);
    margin: 0;
    font-size: var(--font-size-base);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text);
  }

  .form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    transition: var(--transition);
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-lg);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .alert {
    padding: 12px 16px;
    border-radius: var(--radius-md);
    margin-bottom: 20px;
    font-size: var(--font-size-sm);
  }

  .alert-error {
    background: #fee;
    border: 1px solid #fcc;
    color: var(--danger);
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
  }

  .login-footer p {
    color: var(--text-light);
    font-size: var(--font-size-sm);
    margin: 0;
  }
</style>

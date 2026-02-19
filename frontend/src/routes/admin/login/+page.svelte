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
  let showPassword = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      console.log('Attempting login with:', form.email);

      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      auth.login(data.user, data.token);

      // Redirect to dashboard
      goto('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
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
  <div class="login-background">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    <div class="bg-shape bg-shape-3"></div>
  </div>

  <div class="login-card">
    <div class="login-brand">
      <div class="brand-icon">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="currentColor"/>
          <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">JNI Admin</span>
        <span class="brand-subtitle">Consultant Portal</span>
      </div>
    </div>

    <div class="login-header">
      <h1>Welcome back</h1>
      <p>Sign in to access your dashboard</p>
    </div>

    {#if error}
      <div class="alert alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>{error}</span>
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="email">Email Address</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            type="email"
            id="email"
            bind:value={form.email}
            required
            placeholder="admin@jni.com"
            autocomplete="email"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={form.password}
            required
            placeholder="Enter your password"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="password-toggle"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}
          <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <span>Signing in...</span>
        {:else}
          <span>Sign In</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        {/if}
      </button>
    </form>

    <div class="login-footer">
      <a href="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to website</span>
      </a>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f2d1a 0%, #1a4d2e 50%, #1a5c35 100%);
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .login-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .bg-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
  }

  .bg-shape-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -200px;
  }

  .bg-shape-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: -100px;
  }

  .bg-shape-3 {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  }

  .login-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .brand-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 20px rgba(56, 124, 68, 0.3);
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--text-dark);
    letter-spacing: -0.02em;
  }

  .brand-subtitle {
    font-size: 0.8rem;
    color: var(--text-light);
  }

  .login-header {
    margin-bottom: 28px;
  }

  .login-header h1 {
    color: var(--text-dark);
    margin: 0 0 8px 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .login-header p {
    color: var(--text-light);
    margin: 0;
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-dark);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    color: var(--text-light);
    pointer-events: none;
    transition: color 0.2s ease;
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px 14px 46px;
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background: #f8faf8;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px rgba(56, 124, 68, 0.1);
  }

  .form-group input:focus + .input-icon,
  .input-wrapper:focus-within .input-icon {
    color: var(--primary);
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .password-toggle:hover {
    color: var(--primary);
    background: rgba(56, 124, 68, 0.1);
  }

  .btn {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(56, 124, 68, 0.35);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(56, 124, 68, 0.4);
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .alert {
    padding: 14px 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .login-footer {
    text-align: center;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 8px;
  }

  .back-link:hover {
    color: var(--primary);
    background: rgba(56, 124, 68, 0.08);
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 28px 24px;
      border-radius: 20px;
    }

    .login-header h1 {
      font-size: 1.5rem;
    }

    .bg-shape-1 {
      width: 400px;
      height: 400px;
    }

    .bg-shape-2 {
      width: 250px;
      height: 250px;
    }
  }
</style>

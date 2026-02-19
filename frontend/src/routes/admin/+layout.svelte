<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  onMount(() => {
    // Check if user is authenticated
    if (!$user) {
      // If not on login page, redirect to login
      if (window.location.pathname !== '/admin/login') {
        goto('/admin/login');
      }
    }
  });

  function handleLogout() {
    auth.logout();
    goto('/admin/login');
  }

  let { children } = $props();
</script>

{#if $user}
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
        <p class="user-name">{$user.name}</p>
      </div>

      <nav class="sidebar-nav">
        <a href="/admin/dashboard" class:active={window.location.pathname === '/admin/dashboard'}>
          <span>📊</span>
          Dashboard
        </a>
        <a href="/admin/services" class:active={window.location.pathname.startsWith('/admin/services')}>
          <span>🛠️</span>
          Services
        </a>
        <a href="/admin/articles" class:active={window.location.pathname.startsWith('/admin/articles')}>
          <span>📝</span>
          Articles
        </a>
        <a href="/admin/testimonials" class:active={window.location.pathname.startsWith('/admin/testimonials')}>
          <span>💬</span>
          Testimonials
        </a>
        <a href="/admin/clients" class:active={window.location.pathname.startsWith('/admin/clients')}>
          <span>🏢</span>
          Clients
        </a>
        <a href="/admin/gallery" class:active={window.location.pathname.startsWith('/admin/gallery')}>
          <span>🖼️</span>
          Gallery
        </a>
        <a href="/admin/messages" class:active={window.location.pathname.startsWith('/admin/messages')}>
          <span>✉️</span>
          Messages
        </a>
      </nav>

      <div class="sidebar-footer">
        <button onclick={handleLogout} class="btn-logout">
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h1>Admin Dashboard</h1>
        <div class="header-actions">
          <span class="user-badge">{$user.role}</span>
        </div>
      </header>

      <div class="admin-content">
        {@render children()}
      </div>
    </main>
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }

  .admin-sidebar {
    width: 280px;
    background: var(--secondary);
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
  }

  .sidebar-header {
    padding: 30px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-header h2 {
    margin: 0 0 8px 0;
    font-size: var(--font-size-xl);
  }

  .user-name {
    margin: 0;
    font-size: var(--font-size-sm);
    opacity: 0.8;
  }

  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }

  .sidebar-nav a {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    color: white;
    text-decoration: none;
    transition: var(--transition);
    gap: 12px;
  }

  .sidebar-nav a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .sidebar-nav a.active {
    background: var(--primary);
    border-left: 4px solid white;
  }

  .sidebar-nav span {
    font-size: 1.2rem;
  }

  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-logout {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    color: white;
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-logout:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }

  .admin-main {
    flex: 1;
    margin-left: 280px;
    background: var(--bg-light);
  }

  .admin-header {
    background: white;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-sm);
  }

  .admin-header h1 {
    margin: 0;
    font-size: var(--font-size-2xl);
    color: var(--text-dark);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-badge {
    background: var(--primary);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .admin-content {
    padding: 30px;
  }

  @media (max-width: 1024px) {
    .admin-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .admin-sidebar:global(.open) {
      transform: translateX(0);
    }

    .admin-main {
      margin-left: 0;
    }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let sidebarOpen = $state(false);

  onMount(() => {
    if (!$user) {
      if (window.location.pathname !== '/admin/login') {
        goto('/admin/login');
      }
    }
  });

  function handleLogout() {
    auth.logout();
    goto('/admin/login');
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  let { children } = $props();

  const navItems = [
    { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/services', icon: 'services', label: 'Services' },
    { href: '/admin/articles', icon: 'articles', label: 'Articles' },
    { href: '/admin/testimonials', icon: 'testimonials', label: 'Testimonials' },
    { href: '/admin/clients', icon: 'clients', label: 'Clients' },
    { href: '/admin/gallery', icon: 'gallery', label: 'Gallery' },
    { href: '/admin/messages', icon: 'messages', label: 'Messages' }
  ];
</script>

{#if $user}
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button class="menu-toggle" onclick={toggleSidebar} aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="mobile-logo">JNI Admin</span>
      <div class="mobile-user">{$user.name?.charAt(0) || 'A'}</div>
    </header>

    <!-- Sidebar -->
    <aside class="admin-sidebar" class:open={sidebarOpen}>
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="currentColor"/>
            <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">JNI</span>
          <span class="brand-subtitle">Consultant</span>
        </div>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">
          {$user.name?.charAt(0) || 'A'}
        </div>
        <div class="user-details">
          <span class="user-name">{$user.name}</span>
          <span class="user-role">{$user.role === 'super_admin' ? 'Super Admin' : 'Administrator'}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <span class="nav-label">Main Menu</span>
        {#each navItems as item}
          <a
            href={item.href}
            class="nav-item"
            class:active={$page.url.pathname === item.href || (item.href !== '/admin/dashboard' && $page.url.pathname.startsWith(item.href))}
          >
            <span class="nav-icon">
              {#if item.icon === 'dashboard'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1"/>
                  <rect x="14" y="3" width="7" height="5" rx="1"/>
                  <rect x="14" y="12" width="7" height="9" rx="1"/>
                  <rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
              {:else if item.icon === 'services'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              {:else if item.icon === 'articles'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              {:else if item.icon === 'testimonials'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              {:else if item.icon === 'clients'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              {:else if item.icon === 'gallery'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              {:else if item.icon === 'messages'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              {/if}
            </span>
            <span class="nav-label">{item.label}</span>
          </a>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <a href="/" class="footer-link" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>View Website</span>
        </a>
        <button onclick={handleLogout} class="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    {#if sidebarOpen}
      <div class="sidebar-overlay" onclick={() => sidebarOpen = false}></div>
    {/if}

    <!-- Main Content -->
    <main class="admin-main">
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
    background: linear-gradient(135deg, #f8faf8 0%, #f0f4f0 100%);
  }

  /* Mobile Header */
  .mobile-header {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .menu-toggle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: var(--secondary);
    transition: all 0.2s ease;
  }

  .menu-toggle:hover {
    background: rgba(56, 124, 68, 0.08);
    color: var(--primary);
  }

  .mobile-logo {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-dark);
    letter-spacing: -0.02em;
  }

  .mobile-user {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* Sidebar */
  .admin-sidebar {
    width: 280px;
    background: linear-gradient(180deg, #1a2920 0%, #0f1f14 100%);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 200;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .brand-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.3);
  }

  .brand-icon svg {
    color: white;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-weight: 700;
    font-size: 1.25rem;
    color: white;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .brand-subtitle {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    margin: 12px 16px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .user-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary) 0%, #2d6a37 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .user-name {
    font-weight: 600;
    color: white;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 2px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 8px 12px;
    overflow-y: auto;
  }

  .sidebar-nav .nav-label:first-child {
    display: block;
    padding: 8px 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.35);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    border-radius: 10px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.9);
  }

  .nav-item.active {
    background: linear-gradient(135deg, var(--primary) 0%, #2d6a37 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.25);
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0.85;
  }

  .nav-item.active .nav-icon {
    opacity: 1;
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    border-radius: 10px;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }

  .footer-link:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.8);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    color: rgba(239, 68, 68, 0.8);
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 150;
    backdrop-filter: blur(4px);
  }

  /* Main Content */
  .admin-main {
    flex: 1;
    margin-left: 280px;
    min-height: 100vh;
  }

  .admin-content {
    padding: 32px;
    max-width: 1400px;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .mobile-header {
      display: flex;
    }

    .admin-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .admin-sidebar.open {
      transform: translateX(0);
    }

    .sidebar-overlay {
      display: block;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    :global(.admin-sidebar.open) + .sidebar-overlay,
    .admin-sidebar.open ~ .sidebar-overlay {
      opacity: 1;
      pointer-events: auto;
    }

    .admin-main {
      margin-left: 0;
      padding-top: 64px;
    }

    .admin-content {
      padding: 20px;
    }
  }

  @media (max-width: 640px) {
    .admin-content {
      padding: 16px;
    }
  }
</style>

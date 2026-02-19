<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let scrolled = $state(false);
  let mobileOpen = $state(false);
  let mobileMenuElement: HTMLElement | null = $state(null);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/services', label: 'Layanan' },
    { href: '/about', label: 'Tentang Kami' },
    { href: '/blog', label: 'Artikel' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/contact', label: 'Kontak' },
  ];

  onMount(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrolled = window.scrollY > 50;
      }, 10);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  });

  function toggleMobile() {
    mobileOpen = !mobileOpen;
    if (mobileOpen) {
      // Trap focus when menu opens
      setTimeout(() => {
        mobileMenuElement?.querySelector('a')?.focus();
      }, 100);
    }
  }

  function closeMobile() {
    mobileOpen = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && mobileOpen) {
      closeMobile();
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<nav
  class="navbar"
  class:scrolled
  class:hero-nav={!scrolled}
  class:mobile-open={mobileOpen}
  aria-label="Main navigation"
>
  <div class="nav-container">
    <div class="navbar-brand">
      <a href="/" aria-label="Jamnasindo home page">
        <img src="/images/logo-jamnasindoo.png" alt="Jamnasindo" class="logo-img" />
      </a>
    </div>

    <div class="navbar-center" class:active={mobileOpen} bind:this={mobileMenuElement} role="menubar">
      <ul class="navbar-menu">
        {#each navLinks as link}
          <li>
            <a
              href={link.href}
              class:active={$page.url.pathname === link.href ||
                (link.href !== '/' && $page.url.pathname.startsWith(link.href))}
              onclick={closeMobile}
              role="menuitem"
              aria-current={$page.url.pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div class="navbar-actions">
      <a href="/contact" class="navbar-cta">Konsultasi</a>
    </div>

    <button
      class="navbar-toggle"
      class:open={mobileOpen}
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      aria-controls="mobile-menu"
      onclick={toggleMobile}
      type="button"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>

{#if mobileOpen}
  <div class="navbar-overlay" onclick={closeMobile} onkeydown={handleKeyDown} role="presentation" aria-hidden="true"></div>
{/if}

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 12px 0;
    background: transparent;
    transition: padding 0.4s ease-out, background 0.4s ease-out, box-shadow 0.4s ease-out;
  }

  .navbar.scrolled {
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.08);
    padding: 6px 0;
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .logo-img {
    height: 100px !important;
    min-height: 100px;
    width: auto !important;
    max-width: none;
    transition: height 0.4s ease-out, min-height 0.4s ease-out, filter 0.4s ease-out;
  }

  /* White logo on green background */
  .hero-nav .logo-img {
    filter: brightness(0) invert(1);
  }

  .navbar.scrolled .logo-img {
    height: 70px !important;
    min-height: 70px;
    filter: none;
  }

  /* Menu */
  .navbar-menu {
    display: flex;
    gap: 4px;
    list-style: none;
  }

  .navbar-menu a {
    display: block;
    padding: 8px 16px;
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--text-dark);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .navbar-menu a:hover,
  .navbar-menu a.active {
    color: var(--primary);
    background: rgba(56, 124, 68, 0.08);
  }

  /* Hero-aware: white text on home page hero */
  .hero-nav .navbar-menu a {
    color: rgba(255, 255, 255, 0.9);
  }

  .hero-nav .navbar-menu a:hover,
  .hero-nav .navbar-menu a.active {
    color: white;
    background: rgba(255, 255, 255, 0.15);
  }

  .hero-nav .navbar-toggle span {
    background: white;
  }

  /* CTA Button */
  .navbar-cta {
    padding: 10px 24px;
    background: var(--primary);
    color: white !important;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .hero-nav .navbar-cta {
    background: white;
    color: var(--primary) !important;
  }

  .hero-nav .navbar-cta:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  .navbar-cta:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  /* Hamburger */
  .navbar-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
    cursor: pointer;
  }

  .navbar-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-dark);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .navbar-toggle.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .navbar-toggle.open span:nth-child(2) {
    opacity: 0;
  }

  .navbar-toggle.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .navbar-overlay {
    display: none;
  }

  @media (max-width: 768px) {
    .navbar-toggle {
      display: flex;
    }

    .navbar-center {
      position: fixed;
      top: 0;
      right: -300px;
      width: 280px;
      height: 100vh;
      background: white;
      padding: 80px 24px 24px;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      z-index: 999;
    }

    .navbar-center.active {
      right: 0;
    }

    /* Mobile drawer always uses dark text */
    .navbar-center .navbar-menu a {
      color: var(--text-dark);
    }

    .navbar-menu {
      flex-direction: column;
      gap: 4px;
    }

    .navbar-actions {
      display: none;
    }

    .navbar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 998;
    }
  }
</style>

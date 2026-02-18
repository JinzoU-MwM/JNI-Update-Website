<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.status} — JNI Consultant</title>
</svelte:head>

<section class="error-page">
  <div class="error-container">
    <!-- Decorative floating shapes -->
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="error-content">
      <span class="error-code">{$page.status}</span>
      <h1 class="error-title">
        {#if $page.status === 404}
          Halaman Tidak Ditemukan
        {:else}
          Terjadi Kesalahan
        {/if}
      </h1>
      <p class="error-message">
        {#if $page.status === 404}
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        {:else}
          {$page.error?.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'}
        {/if}
      </p>
      <div class="error-actions">
        <a href="/" class="btn-home">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Kembali ke Beranda
        </a>
        <a href="/contact" class="btn-contact">Hubungi Kami</a>
      </div>
    </div>
  </div>
</section>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 60px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, var(--primary-dark, #1e4d2b) 0%, var(--primary, #387C44) 15%, #e8f5e9 40%, #f1f5f9 100%);
  }

  .error-container {
    position: relative;
    max-width: 600px;
    width: 100%;
    text-align: center;
    z-index: 1;
  }

  /* Decorative floating shapes */
  .floating-shapes {
    position: absolute;
    inset: -100px;
    pointer-events: none;
    z-index: 0;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.08;
  }

  .shape-1 {
    width: 300px;
    height: 300px;
    background: var(--primary, #387C44);
    top: -50px;
    right: -80px;
    animation: float 8s ease-in-out infinite;
  }

  .shape-2 {
    width: 200px;
    height: 200px;
    background: var(--accent, #f59e0b);
    bottom: -30px;
    left: -60px;
    animation: float 6s ease-in-out infinite reverse;
  }

  .shape-3 {
    width: 120px;
    height: 120px;
    background: var(--primary-light, #4a9e58);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: float 10s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }

  .error-content {
    position: relative;
    z-index: 1;
  }

  .error-code {
    display: block;
    font-family: var(--font-family, 'Jost', sans-serif);
    font-size: clamp(6rem, 15vw, 10rem);
    font-weight: 700;
    line-height: 1;
    background: linear-gradient(135deg, var(--primary, #387C44) 0%, var(--primary-light, #4a9e58) 50%, var(--accent, #f59e0b) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
    letter-spacing: -4px;
    filter: drop-shadow(0 4px 12px rgba(56, 124, 68, 0.15));
  }

  .error-title {
    font-family: var(--font-family, 'Jost', sans-serif);
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    color: var(--text-dark, #0f172a);
    margin: 0 0 16px;
  }

  .error-message {
    font-family: var(--font-family, 'Jost', sans-serif);
    font-size: var(--font-size-lg, 1.125rem);
    color: var(--text-light, #64748b);
    line-height: 1.7;
    margin: 0 0 40px;
    max-width: 450px;
    margin-inline: auto;
  }

  .error-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .btn-home {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--primary, #387C44), var(--primary-dark, #1e4d2b));
    color: white;
    border-radius: 12px;
    font-family: var(--font-family, 'Jost', sans-serif);
    font-size: var(--font-size-base, 1rem);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(56, 124, 68, 0.25);
  }

  .btn-home:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(56, 124, 68, 0.35);
  }

  .btn-contact {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    background: transparent;
    color: var(--primary, #387C44);
    border: 2px solid var(--primary, #387C44);
    border-radius: 12px;
    font-family: var(--font-family, 'Jost', sans-serif);
    font-size: var(--font-size-base, 1rem);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .btn-contact:hover {
    background: var(--primary, #387C44);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(56, 124, 68, 0.2);
  }

  @media (max-width: 480px) {
    .error-actions {
      flex-direction: column;
    }

    .btn-home, .btn-contact {
      width: 100%;
      justify-content: center;
    }
  }
</style>

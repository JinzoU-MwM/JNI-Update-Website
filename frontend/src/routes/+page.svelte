<script lang="ts">
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import SkeletonText from '$lib/components/SkeletonText.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  let { data } = $props();

  // Duplicate testimonials for seamless marquee
  const row1 = $derived([...data.testimonials, ...data.testimonials]);
  const row2 = $derived([...data.testimonials.slice().reverse(), ...data.testimonials.slice().reverse()]);

  // Duplicate clients for marquee
  const clientRow1 = $derived([...data.clients, ...data.clients]);
  const clientRow2 = $derived([...data.clients, ...data.clients].reverse());
</script>

<svelte:head>
  <title>Jamnasindo - Konsultan Perizinan & Legalitas Bisnis Terpercaya</title>
  <meta name="description" content="JNI Consultant - Partner terpercaya untuk izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan." />
</svelte:head>

<!-- HERO SECTION -->
<section class="hero">
  <div class="hero-bg-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
  <div class="container">
    <div class="hero-content">
      <span class="hero-badge">🏆 Konsultan Perizinan #1 di Indonesia</span>
      <h1>Solusi <span class="highlight">Perizinan</span> & Legalitas Bisnis Anda</h1>
      <p>Kami membantu mengurus segala kebutuhan perizinan dan legalitas bisnis Anda secara profesional, cepat, dan transparan.</p>
      <div class="hero-actions">
        <a href="/contact" class="btn btn-white">Konsultasi Gratis</a>
        <a href="/services" class="btn btn-outline-white">Lihat Layanan</a>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">500+</span>
          <span class="stat-label">Klien Terlayani</span>
        </div>
        <div class="stat">
          <span class="stat-number">10+</span>
          <span class="stat-label">Tahun Pengalaman</span>
        </div>
        <div class="stat">
          <span class="stat-number">99%</span>
          <span class="stat-label">Tingkat Kepuasan</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES SECTION -->
<section class="section services-home">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Layanan Kami</span>
      <h2>Solusi Profesional untuk <span>Kebutuhan Bisnis</span></h2>
      <p>Kami menyediakan berbagai layanan konsultasi perizinan dan legalitas bisnis yang komprehensif.</p>
    </div>

    <div class="services-grid">
      {#if data.services.length === 0}
        <div class="loading-state">
          {#each Array(6) as _}
            <SkeletonCard height="280px" />
          {/each}
        </div>
      {:else}
        {#each data.services as service}
          <a href="/services/{service.slug}" class="service-card">
            <div class="service-icon">
              {#if service.icon_svg}
                {@html service.icon_svg}
              {:else if service.image_url}
                <img src={service.image_url} alt={service.title} style="width:40px;height:40px;object-fit:contain;" />
              {/if}
            </div>
            <h3>{service.title}</h3>
            <p>{service.short_description}</p>
            <span class="btn-card">Selengkapnya</span>
          </a>
        {/each}
      {/if}
    </div>

    {#if data.error}
      <ErrorMessage title="Gagal memuat layanan" message={data.error} />
    {/if}
  </div>
</section>

<!-- TESTIMONIALS SECTION -->
{#if data.testimonials.length > 0}
<section class="section testimonials-section" style="background:var(--bg-light);">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Testimoni</span>
      <h2>Apa Kata <span>Klien Kami</span></h2>
      <p>Kepuasan klien adalah prioritas kami. Berikut pengalaman mereka bersama JNI Consultant.</p>
    </div>
  </div>

  <div class="testimonials-marquee-wrapper">
    <div class="marquee-row">
      <div class="marquee-track scroll-right">
        {#each row1 as t}
          <div class="testimonial-card">
            <div class="stars">{'★'.repeat(t.rating)}</div>
            <p class="review-text">"{t.review_text}"</p>
            <div class="client-info">
              <img src={t.photo_url} alt={t.client_name} class="client-avatar" />
              <div>
                <div class="client-name">{t.client_name}</div>
                <div class="client-role">{t.client_role}</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if data.testimonials.length > 3}
      <div class="marquee-row">
        <div class="marquee-track scroll-left">
          {#each row2 as t}
            <div class="testimonial-card">
              <div class="stars">{'★'.repeat(t.rating)}</div>
              <p class="review-text">"{t.review_text}"</p>
              <div class="client-info">
                <img src={t.photo_url} alt={t.client_name} class="client-avatar" />
                <div>
                  <div class="client-name">{t.client_name}</div>
                  <div class="client-role">{t.client_role}</div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>
{/if}

<!-- CLIENTS SECTION -->
{#if data.clients.length > 0}
<section class="section clients-section">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Dipercaya Oleh</span>
      <h2>Klien <span>Kami</span></h2>
      <p>Berbagai perusahaan dan instansi telah mempercayakan kebutuhan perizinan mereka kepada kami.</p>
    </div>
  </div>

  <div class="testimonials-marquee-wrapper">
    <div class="marquee-row">
      <div class="marquee-track scroll-right">
        {#each clientRow1 as client}
          <div class="marquee-logo">
            <img src={client.logo_path} alt={client.client_name} />
          </div>
        {/each}
      </div>
    </div>
    <div class="marquee-row">
      <div class="marquee-track scroll-left">
        {#each clientRow2 as client}
          <div class="marquee-logo">
            <img src={client.logo_path} alt={client.client_name} />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
{/if}

<!-- CTA SECTION -->
<section class="cta">
  <div class="container">
    <h2>Siap Memulai?</h2>
    <p>Konsultasikan kebutuhan legalitas dan perizinan bisnis Anda secara gratis.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/contact" class="btn btn-white">Hubungi Kami</a>
      <a href="https://wa.me/6281234567890" class="btn btn-outline-white" target="_blank">Chat WhatsApp</a>
    </div>
  </div>
</section>

<style>
  /* === HERO === */
  .hero {
    position: relative;
    background: linear-gradient(135deg, #1e4d2b 0%, #387C44 50%, #2d6a37 100%);
    padding: 180px 0 120px;
    overflow: hidden;
    color: white;
    text-align: center;
  }

  .hero-bg-shapes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
  }

  .shape-1 { width: 600px; height: 600px; top: -200px; right: -100px; }
  .shape-2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
  .shape-3 { width: 200px; height: 200px; top: 50%; left: 50%; }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .hero h1 {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 20px;
  }

  .hero h1 .highlight {
    background: linear-gradient(135deg, #f0fdf4, #bbf7d0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    font-size: 1.15rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }

  .btn-outline-white {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.4);
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-outline-white:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .services-home {
    padding-bottom: 80px;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 140px 0 80px;
    }

    .hero h1 {
      font-size: 2rem;
    }

    .hero-stats {
      gap: 24px;
    }
  }
</style>

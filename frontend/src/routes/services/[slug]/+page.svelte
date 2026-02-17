<script lang="ts">
  let { data } = $props();
  const { service } = data;
</script>

<svelte:head>
  <title>{service.title} - Jamnasindo</title>
  <meta name="description" content={service.short_description} />
</svelte:head>

<!-- Hero -->
<header class="service-hero">
  <div class="container">
    <div class="service-icon-box">
      {#if service.icon_svg}
        {@html service.icon_svg}
      {:else if service.image_url}
        <img src={service.image_url} alt={service.title} style="width:4rem;height:4rem;object-fit:contain;border-radius:50%;" />
      {/if}
    </div>
    <h1>{service.title}</h1>
    <p>{service.short_description}</p>
  </div>
</header>

<main class="container">
  <div class="service-content-wrapper">
    <!-- Main Content -->
    <div class="main-content">
      {#if service.full_description}
        <div class="content-section">
          <h2 class="section-title">Tentang Layanan</h2>
          <div class="prose">{@html service.full_description}</div>
        </div>
      {/if}

      {#if service.requirements}
        <div class="content-section">
          <h2 class="section-title">Persyaratan Dokumen</h2>
          <div class="requirements-list">{@html service.requirements}</div>
        </div>
      {/if}

      {#if service.benefits}
        <div class="content-section">
          <h2 class="section-title">Keuntungan Layanan Kami</h2>
          <div class="benefit-grid">
            <div class="benefit-card">
              <div class="benefit-icon">✓</div>
              <div class="prose">{@html service.benefits}</div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Sidebar -->
    <aside class="sticky-sidebar">
      <div class="cta-card">
        <h3>Butuh Bantuan?</h3>
        <p>Konsultasikan kebutuhan legalitas Anda secara gratis bersama ahli kami.</p>
        <a href="https://wa.me/6281234567890?text=Halo JNI, saya ingin konsultasi mengenai {encodeURIComponent(service.title)}" 
           class="btn-whatsapp" target="_blank">
          💬 Chat WhatsApp
        </a>
        <a href="/contact" class="btn-contact">Hubungi Kami</a>
      </div>
    </aside>
  </div>
</main>

<style>
  .service-hero {
    background: linear-gradient(135deg, #1e4d2b 0%, #387C44 100%);
    padding: 180px 0 120px;
    color: white;
    text-align: center;
  }

  .service-hero h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .service-hero p {
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.1rem;
  }

  .service-icon-box {
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    backdrop-filter: blur(12px);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .service-icon-box :global(svg) {
    width: 4rem;
    height: 4rem;
    color: white;
    opacity: 0.95;
  }

  .service-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 60px;
    margin-top: -60px;
    margin-bottom: 80px;
    position: relative;
    z-index: 10;
  }

  .main-content {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .content-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-title::before {
    content: '';
    width: 6px;
    height: 28px;
    background: var(--primary);
    border-radius: 4px;
  }

  .prose {
    color: #475569;
    line-height: 1.8;
    font-size: 1.05rem;
  }

  .requirements-list {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    color: #334155;
  }

  .benefit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  .benefit-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }

  .benefit-icon {
    color: var(--primary);
    font-size: 2rem;
    margin-bottom: 12px;
  }

  .sticky-sidebar {
    position: sticky;
    top: 100px;
    height: fit-content;
  }

  .cta-card {
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    border-top: 6px solid var(--primary);
  }

  .cta-card h3 {
    font-size: 1.3rem;
    margin-bottom: 12px;
    color: #1e293b;
  }

  .cta-card p {
    color: #64748b;
    margin-bottom: 20px;
    font-size: 0.95rem;
  }

  .btn-whatsapp {
    display: block;
    padding: 14px;
    background: #25D366;
    color: white;
    border-radius: 10px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 12px;
    transition: all 0.3s ease;
  }

  .btn-whatsapp:hover {
    background: #20bd5a;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 211, 102, 0.3);
  }

  .btn-contact {
    display: block;
    padding: 14px;
    border: 2px solid var(--primary);
    color: var(--primary);
    border-radius: 10px;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
  }

  .btn-contact:hover {
    background: var(--primary);
    color: white;
  }

  @media (max-width: 991px) {
    .service-content-wrapper {
      grid-template-columns: 1fr;
      margin-top: 0;
    }

    .main-content {
      padding: 24px;
      box-shadow: none;
      background: transparent;
    }

    .sticky-sidebar {
      position: static;
      margin-top: 40px;
    }

    .service-hero h1 {
      font-size: 2rem;
    }
  }
</style>

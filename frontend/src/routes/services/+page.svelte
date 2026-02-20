<script lang="ts">
  let { data } = $props();

  let searchQuery = $state('');

  // Filter services based on search
  const filteredServices = $derived(() => {
    if (!searchQuery.trim()) return data.services;

    const query = searchQuery.toLowerCase();
    return data.services.filter(
      (s: { title: string; short_description: string }) =>
        s.title.toLowerCase().includes(query) ||
        s.short_description?.toLowerCase().includes(query)
    );
  });
</script>

<svelte:head>
  <title>Layanan Kami - Jamnasindo</title>
  <meta name="description" content="Layanan Konsultan JNI - Izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan." />
  <link rel="canonical" href="https://jamnasindo.id/services" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://jamnasindo.id/services" />
  <meta property="og:title" content="Layanan Kami - Jamnasindo" />
  <meta property="og:description" content="Layanan Konsultan JNI - Izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan." />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="page-header">
  <div class="container">
    <h1>Layanan Kami</h1>
    <div class="breadcrumb">
      <a href="/">Beranda</a>
      <span class="breadcrumb-separator">/</span>
      <span>Layanan</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Layanan Lengkap</span>
      <h2>Solusi Profesional untuk <span>Kebutuhan Bisnis</span></h2>
    </div>

    <!-- Search Bar -->
    <div class="search-wrapper">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari layanan..."
          class="search-input"
        />
        {#if searchQuery}
          <button type="button" class="clear-search" onclick={() => searchQuery = ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        {/if}
      </div>
      {#if searchQuery}
        <p class="results-count">Menampilkan {filteredServices().length} layanan</p>
      {/if}
    </div>

    {#if filteredServices().length > 0}
      <div class="services-grid">
        {#each filteredServices() as service}
          <a href="/services/{service.slug}" class="service-card">
            <div class="service-icon">
              {#if service.icon_svg}
                {@html service.icon_svg}
              {:else if service.image_url}
                <img src={service.image_url} alt={service.title} loading="lazy" style="width:40px;height:40px;object-fit:contain;" />
              {/if}
            </div>
            <h3>{service.title}</h3>
            <p>{service.short_description}</p>
            <span class="btn-card">Selengkapnya</span>
          </a>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Tidak ada layanan yang ditemukan.</p>
        <button type="button" class="btn-reset" onclick={() => searchQuery = ''}>
          Reset Pencarian
        </button>
      </div>
    {/if}
  </div>
</section>

<section class="cta">
  <div class="container">
    <h2>Butuh Layanan Lain?</h2>
    <p>Hubungi kami untuk konsultasi kebutuhan perizinan dan legalitas bisnis Anda.</p>
    <a href="/contact" class="btn btn-white">Hubungi Kami</a>
  </div>
</section>

<style>
  .search-wrapper {
    margin-bottom: 32px;
  }

  .search-box {
    position: relative;
    max-width: 400px;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    color: var(--text-light);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 14px 44px;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 0.95rem;
    background: white;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(56, 124, 68, 0.1);
  }

  .clear-search {
    position: absolute;
    right: 12px;
    width: 28px;
    height: 28px;
    border: none;
    background: #f1f5f9;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
    transition: all 0.2s ease;
  }

  .clear-search:hover {
    background: #e2e8f0;
    color: var(--text);
  }

  .results-count {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-top: 12px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .service-card {
    display: block;
    background: white;
    padding: 32px;
    border-radius: 16px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }

  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }

  .service-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .service-icon :global(svg) {
    width: 32px;
    height: 32px;
    color: white;
  }

  .service-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 10px;
  }

  .service-card p {
    color: var(--text-light);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .btn-card {
    color: var(--primary);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;
    color: var(--text-light);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }

  .empty-state p {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  .btn-reset {
    padding: 12px 24px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-reset:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.3);
  }

  @media (max-width: 768px) {
    .services-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Galeri - Jamnasindo</title>
  <meta name="description" content="Galeri foto kegiatan dan dokumentasi layanan JNI Consultant." />
  <link rel="canonical" href="https://jamnasindo.id/gallery" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://jamnasindo.id/gallery" />
  <meta property="og:title" content="Galeri - Jamnasindo" />
  <meta property="og:description" content="Galeri foto kegiatan dan dokumentasi layanan JNI Consultant." />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="page-header">
  <div class="container">
    <h1>Galeri</h1>
    <div class="breadcrumb">
      <a href="/">Beranda</a>
      <span class="breadcrumb-separator">/</span>
      <span>Galeri</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <!-- Category Filter -->
    {#if data.categories.length > 0}
      <div class="gallery-filter">
        <a href="/gallery" class="filter-btn" class:active={data.currentCategory === 'all'}>Semua</a>
        {#each data.categories as cat}
          <a href="/gallery?category={cat}" class="filter-btn" class:active={data.currentCategory === cat}>{cat}</a>
        {/each}
      </div>
    {/if}

    {#if data.items.length > 0}
      <div class="gallery-grid">
        {#each data.items as item}
          <div class="gallery-item">
            <img src={item.image_url} alt={item.title || 'Gallery'} loading="lazy" />
            {#if item.title}
              <div class="gallery-overlay">
                <span>{item.title}</span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <p>Belum ada foto di galeri.</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .gallery-filter {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 40px;
  }

  .filter-btn {
    padding: 8px 20px;
    border-radius: 50px;
    font-weight: 500;
    font-size: 0.9rem;
    border: 1px solid var(--border);
    color: var(--text);
    transition: all 0.3s ease;
  }

  .filter-btn:hover,
  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: pointer;
  }

  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.1);
  }

  .gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .gallery-item:hover .gallery-overlay {
    opacity: 1;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;
    color: var(--text-light);
    font-size: 1.1rem;
  }
</style>

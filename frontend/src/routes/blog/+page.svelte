<script lang="ts">
  let { data } = $props();

  let searchQuery = $state('');
  let selectedCategory = $state('');

  // Get unique categories from articles
  const categories = $derived(() => {
    const cats = new Set(data.articles.map((a: { category: string }) => a.category));
    return ['', ...Array.from(cats)];
  });

  // Filter articles based on search and category
  const filteredArticles = $derived(() => {
    let articles = data.articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        (a: { title: string; excerpt: string; category: string; author: string }) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt?.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.author?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      articles = articles.filter((a: { category: string }) => a.category === selectedCategory);
    }

    return articles;
  });

  function clearFilters() {
    searchQuery = '';
    selectedCategory = '';
  }
</script>

<svelte:head>
  <title>Artikel & Berita - Jamnasindo</title>
  <meta name="description" content="Baca artikel terbaru seputar perizinan, legalitas bisnis, dan tips untuk pengusaha dari JNI Consultant." />
  <link rel="canonical" href="https://jamnasindo.id/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://jamnasindo.id/blog" />
  <meta property="og:title" content="Artikel & Berita - Jamnasindo" />
  <meta property="og:description" content="Baca artikel terbaru seputar perizinan, legalitas bisnis, dan tips untuk pengusaha dari JNI Consultant." />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="page-header">
  <div class="container">
    <h1>Artikel & Berita</h1>
    <div class="breadcrumb">
      <a href="/">Beranda</a>
      <span class="breadcrumb-separator">/</span>
      <span>Artikel</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <!-- Search & Filter -->
    <div class="search-filter-bar">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari artikel..."
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

      <div class="filter-group">
        <select bind:value={selectedCategory} class="category-select">
          {#each categories() as cat}
            <option value={cat}>{cat || 'Semua Kategori'}</option>
          {/each}
        </select>

        {#if searchQuery || selectedCategory}
          <button type="button" class="clear-filters" onclick={clearFilters}>
            Reset Filter
          </button>
        {/if}
      </div>
    </div>

    <!-- Results count -->
    {#if searchQuery || selectedCategory}
      <p class="results-count">
        Menampilkan {filteredArticles().length} dari {data.articles.length} artikel
      </p>
    {/if}

    {#if filteredArticles().length > 0}
      <div class="articles-grid">
        {#each filteredArticles() as article}
          <a href="/blog/{article.slug}" class="article-card">
            <div class="article-image">
              {#if article.image_url}
                <img src={article.image_url} alt={article.title} loading="lazy" />
              {:else}
                <div class="article-placeholder">📰</div>
              {/if}
              <span class="article-category">{article.category}</span>
            </div>
            <div class="article-body">
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <div class="article-meta">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.read_time}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>

      <!-- Pagination (only show when no filters) -->
      {#if !searchQuery && !selectedCategory && data.pagination.totalPages > 1}
        <div class="pagination">
          {#each Array(data.pagination.totalPages) as _, i}
            <a href="/blog?page={i + 1}"
               class="page-link"
               class:active={data.pagination.page === i + 1}>
              {i + 1}
            </a>
          {/each}
        </div>
      {/if}
    {:else}
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Tidak ada artikel yang ditemukan.</p>
        {#if searchQuery || selectedCategory}
          <button type="button" class="btn-reset" onclick={clearFilters}>
            Reset Filter
          </button>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .search-filter-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    min-width: 280px;
    position: relative;
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

  .filter-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .category-select {
    padding: 14px 40px 14px 16px;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 0.95rem;
    background: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .category-select:focus {
    outline: none;
    border-color: var(--primary);
  }

  .clear-filters {
    padding: 14px 20px;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: white;
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-filters:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .results-count {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }

  .article-card {
    display: block;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }

  .article-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .article-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: #f1f5f9;
  }

  .article-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .article-card:hover .article-image img {
    transform: scale(1.05);
  }

  .article-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 3rem;
  }

  .article-category {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 12px;
    background: var(--primary);
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .article-body {
    padding: 24px;
  }

  .article-body h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-body p {
    color: var(--text-light);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    gap: 8px;
    color: var(--text-light);
    font-size: 0.8rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 48px;
  }

  .page-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-weight: 600;
    color: var(--text);
    transition: all 0.3s ease;
  }

  .page-link:hover,
  .page-link.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
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
    .search-filter-bar {
      flex-direction: column;
    }

    .search-box {
      min-width: 100%;
    }

    .filter-group {
      width: 100%;
    }

    .category-select {
      flex: 1;
    }

    .articles-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script lang="ts">
  let { data } = $props();
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
    {#if data.articles.length > 0}
      <div class="articles-grid">
        {#each data.articles as article}
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

      <!-- Pagination -->
      {#if data.pagination.totalPages > 1}
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
        <p>Belum ada artikel yang dipublikasikan.</p>
      </div>
    {/if}
  </div>
</section>

<style>
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
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .articles-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

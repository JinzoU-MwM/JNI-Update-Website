<script lang="ts">
  import { onMount } from 'svelte';
  import { adminGet, adminPut } from '$lib/api/admin';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    is_published: boolean;
    created_at: string;
  }

  let articles = $state<Article[]>([]);
  let loading = $state(true);
  let error = $state('');
  let searchQuery = $state('');
  let filterStatus = $state<'all' | 'published' | 'draft'>('all');

  let filteredArticles = $derived(articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && article.is_published) ||
      (filterStatus === 'draft' && !article.is_published);
    return matchesSearch && matchesStatus;
  }));

  onMount(async () => {
    await loadArticles();
  });

  async function loadArticles() {
    loading = true;
    error = '';

    try {
      const response = await adminGet('/articles?page=1&limit=50');
      if (!response.ok) throw new Error('Failed to fetch articles');

      const data = await response.json();
      articles = data.articles || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load articles';
    } finally {
      loading = false;
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const response = await adminPut(`/articles/${id}`, { is_published: !currentStatus });

      if (!response.ok) throw new Error('Failed to update article');

      await loadArticles();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update article');
    }
  }
</script>

<svelte:head>
  <title>Articles - Admin Dashboard</title>
</svelte:head>

<div class="articles-page">
  <div class="page-header">
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Articles</h1>
        <p>Manage your blog content</p>
      </div>
    </div>
    <a href="/admin/articles/new" class="btn btn-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Write Article</span>
    </a>
  </div>

  {#if !loading && !error && articles.length > 0}
    <div class="filters-bar">
      <div class="search-input">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search articles..."
          bind:value={searchQuery}
        />
      </div>
      <div class="filter-buttons">
        <button
          class="filter-btn"
          class:active={filterStatus === 'all'}
          onclick={() => filterStatus = 'all'}
        >
          All
        </button>
        <button
          class="filter-btn"
          class:active={filterStatus === 'published'}
          onclick={() => filterStatus = 'published'}
        >
          Published
        </button>
        <button
          class="filter-btn"
          class:active={filterStatus === 'draft'}
          onclick={() => filterStatus = 'draft'}
        >
          Drafts
        </button>
      </div>
      <span class="result-count">{filteredArticles.length} articles</span>
    </div>
  {/if}

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadArticles} />
  {:else if loading}
    <div class="loading-list">
      {#each Array(5) as _}
        <SkeletonCard height="120px" />
      {/each}
    </div>
  {:else if articles.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <h2>No Articles Yet</h2>
      <p>Start writing your first article to share your expertise</p>
      <a href="/admin/articles/new" class="btn btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span>Write Article</span>
      </a>
    </div>
  {:else if filteredArticles.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h2>No Results Found</h2>
      <p>Try a different search term or filter</p>
    </div>
  {:else}
    <div class="articles-list">
      {#each filteredArticles as article}
        <div class="article-card">
          <div class="article-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="article-info">
            <div class="article-header">
              <h3>{article.title}</h3>
              <span class="status-badge {article.is_published ? 'published' : 'draft'}">
                {#if article.is_published}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                {:else}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                {/if}
                <span>{article.is_published ? 'Published' : 'Draft'}</span>
              </span>
            </div>
            <p class="article-excerpt">{article.excerpt}</p>
            <div class="article-meta">
              <span class="category-badge">{article.category}</span>
              <span class="date-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div class="article-actions">
            <a href={`/admin/articles/${article.id}`} class="btn btn-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </a>
            <button
              onclick={() => togglePublish(article.id, article.is_published)}
              class="btn btn-toggle {article.is_published ? 'unpublish' : 'publish'}"
            >
              {#if article.is_published}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                <span>Unpublish</span>
              {:else}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Publish</span>
              {/if}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .articles-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1565c0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-text h1 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .header-text p {
    margin: 4px 0 0 0;
    color: var(--text-light);
    font-size: 0.9rem;
  }

  .filters-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 12px 18px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
  }

  .search-input {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 200px;
  }

  .search-input svg {
    color: var(--text-light);
    flex-shrink: 0;
  }

  .search-input input {
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: var(--text-dark);
    width: 100%;
  }

  .filter-buttons {
    display: flex;
    gap: 6px;
  }

  .filter-btn {
    padding: 6px 14px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-light);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn:hover {
    background: #f0f4f0;
    color: var(--text);
  }

  .filter-btn.active {
    background: var(--primary);
    color: white;
  }

  .result-count {
    font-size: 0.75rem;
    color: var(--text-light);
    background: #f0f4f0;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .loading-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .empty-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0f4f0 0%, #e0e8e0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
  }

  .empty-state h2 {
    margin: 0 0 10px 0;
    color: var(--text-dark);
    font-size: 1.25rem;
    font-weight: 700;
  }

  .empty-state p {
    margin: 0 0 28px 0;
    color: var(--text-light);
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .article-card {
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
  }

  .article-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .article-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1565c0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .article-info {
    flex: 1;
    min-width: 0;
  }

  .article-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .article-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1rem;
    font-weight: 600;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.published {
    background: rgba(56, 124, 68, 0.1);
    color: var(--primary);
  }

  .status-badge.draft {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  }

  .article-excerpt {
    margin: 0 0 10px 0;
    color: var(--text-light);
    font-size: 0.85rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }

  .category-badge {
    background: rgba(21, 101, 192, 0.1);
    color: #1565c0;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .date-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-light);
    font-size: 0.75rem;
  }

  .article-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  .btn {
    padding: 10px 16px;
    border: none;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(56, 124, 68, 0.3);
  }

  .btn-edit {
    background: #f8faf8;
    color: var(--text);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .btn-edit:hover {
    background: white;
    border-color: var(--primary);
    color: var(--primary);
  }

  .btn-toggle {
    background: rgba(56, 124, 68, 0.08);
    color: var(--primary);
  }

  .btn-toggle:hover {
    background: rgba(56, 124, 68, 0.15);
  }

  .btn-toggle.unpublish {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }

  .btn-toggle.unpublish:hover {
    background: rgba(239, 68, 68, 0.15);
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 20px;
      align-items: stretch;
    }

    .article-card {
      flex-direction: column;
      align-items: stretch;
    }

    .article-icon {
      display: none;
    }

    .article-actions {
      width: 100%;
    }

    .article-actions .btn {
      flex: 1;
    }

    .btn-primary {
      justify-content: center;
    }

    .filters-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input {
      width: 100%;
    }

    .filter-buttons {
      justify-content: center;
    }
  }
</style>

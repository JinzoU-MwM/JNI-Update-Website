<script lang="ts">
  import { onMount } from 'svelte';
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

  onMount(async () => {
    await loadArticles();
  });

  async function loadArticles() {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/articles?page=1&limit=50');
      if (!response.ok) throw new Error('Failed to fetch articles');

      const data = await response.json();
      articles = data.articles;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load articles';
    } finally {
      loading = false;
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`https://backend-nine-dun-99.vercel.app/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_published: !currentStatus })
      });

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
    <h1>Articles</h1>
    <a href="/admin/articles/new" class="btn btn-primary">Write New Article</a>
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadArticles} />
  {:else if loading}
    <div class="loading-list">
      {#each Array(5) as _}
        <SkeletonCard height="100px" />
      {/each}
    </div>
  {:else if articles.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📝</div>
      <h2>No Articles Yet</h2>
      <p>Start writing your first article to share your expertise</p>
      <a href="/admin/articles/new" class="btn btn-primary">Write Article</a>
    </div>
  {:else}
    <div class="articles-list">
      {#each articles as article}
        <div class="article-card">
          <div class="article-info">
            <h3>{article.title}</h3>
            <p class="article-excerpt">{article.excerpt}</p>
            <div class="article-meta">
              <span class="category-badge">{article.category}</span>
              <span class="date-badge">{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="article-actions">
            <span class="status-badge {article.is_published ? 'published' : 'draft'}">
              {article.is_published ? 'Published' : 'Draft'}
            </span>
            <a href={`/admin/articles/${article.id}`} class="btn btn-sm">Edit</a>
            <button
              onclick={() => togglePublish(article.id, article.is_published)}
              class="btn btn-sm btn-toggle"
            >
              {article.is_published ? 'Unpublish' : 'Publish'}
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
    margin-bottom: 30px;
  }

  .page-header h1 {
    margin: 0;
    color: var(--text-dark);
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
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .empty-state h2 {
    margin: 0 0 10px 0;
    color: var(--text-dark);
  }

  .empty-state p {
    margin: 0 0 30px 0;
    color: var(--text-light);
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .article-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .article-info {
    flex: 1;
  }

  .article-info h3 {
    margin: 0 0 8px 0;
    color: var(--text-dark);
    font-size: var(--font-size-lg);
  }

  .article-excerpt {
    margin: 0 0 12px 0;
    color: var(--text-light);
    line-height: 1.6;
  }

  .article-meta {
    display: flex;
    gap: 12px;
  }

  .category-badge {
    background: var(--primary);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: var(--font-size-xs);
    font-weight: 600;
  }

  .date-badge {
    color: var(--text-light);
    font-size: var(--font-size-xs);
  }

  .article-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.published {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.draft {
    background: #fef3c7;
    color: #92400e;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: var(--transition);
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: var(--font-size-xs);
  }

  .btn-toggle {
    background: var(--bg-alt);
    color: var(--text);
  }

  .btn-toggle:hover {
    background: var(--border);
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .article-card {
      flex-direction: column;
      align-items: stretch;
    }

    .article-actions {
      flex-direction: row;
      align-items: center;
    }
  }
</style>

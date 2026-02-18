<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    category: string;
    created_at: string;
  }

  let gallery = $state<GalleryItem[]>([]);
  let categories = $state<string[]>([]);
  let selectedCategory = $state<string>('all');
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadGallery();
  });

  async function loadGallery() {
    loading = true;
    error = '';

    try {
      let url = 'https://backend-nine-dun-99.vercel.app/api/gallery';
      if (selectedCategory !== 'all') {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch gallery');

      const data = await response.json();
      gallery = data.items;
      categories = data.categories;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load gallery';
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadGallery();
  });

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`https://backend-nine-dun-99.vercel.app/api/gallery/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete item');

      await loadGallery();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    }
  }
</script>

<svelte:head>
  <title>Gallery - Admin Dashboard</title>
</svelte:head>

<div class="gallery-page">
  <div class="page-header">
    <h1>Gallery</h1>
    <a href="/admin/gallery/new" class="btn btn-primary">Add Photo</a>
  </div>

  <div class="category-filters">
    {#each categories as category}
      <button
        class="category-btn"
        class:active={selectedCategory === category}
        onclick={() => selectedCategory = category}
      >
        {category}
      </button>
    {/each}
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadGallery} />
  {:else if loading}
    <div class="loading-grid">
      {#each Array(8) as _}
        <SkeletonCard height="200px" />
      {/each}
    </div>
  {:else if gallery.length === 0}
    <div class="empty-state">
      <div class="empty-icon">🖼️</div>
      <h2>No Photos Yet</h2>
      <p>Add photos to showcase your work and projects</p>
      <a href="/admin/gallery/new" class="btn btn-primary">Add Photo</a>
    </div>
  {:else}
    <div class="gallery-grid">
      {#each gallery as item}
        <div class="gallery-card">
          <div class="gallery-image-container">
            <img src={item.image_url} alt={item.title || 'Gallery item'} class="gallery-image" loading="lazy" />
            <div class="gallery-overlay">
              <button onclick={() => deleteItem(item.id)} class="btn btn-delete">🗑️ Delete</button>
            </div>
          </div>
          <div class="gallery-info">
            <h3>{item.title || 'Untitled'}</h3>
            <span class="category-tag">{item.category}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .gallery-page {
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .page-header h1 {
    margin: 0;
    color: var(--text-dark);
  }

  .category-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 8px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    background: white;
    color: var(--text);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .category-btn:hover {
    border-color: var(--primary);
  }

  .category-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
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

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .gallery-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: var(--transition);
  }

  .gallery-card:hover {
    box-shadow: var(--shadow-lg);
  }

  .gallery-image-container {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .gallery-card:hover .gallery-image {
    transform: scale(1.05);
  }

  .gallery-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .gallery-card:hover .gallery-overlay {
    opacity: 1;
  }

  .btn-delete {
    background: var(--danger);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-delete:hover {
    background: #dc2626;
    transform: scale(1.05);
  }

  .gallery-info {
    padding: 16px;
  }

  .gallery-info h3 {
    margin: 0 0 8px 0;
    color: var(--text-dark);
    font-size: var(--font-size-base);
  }

  .category-tag {
    display: inline-block;
    background: var(--bg-alt);
    color: var(--text);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: var(--font-size-xs);
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

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style>

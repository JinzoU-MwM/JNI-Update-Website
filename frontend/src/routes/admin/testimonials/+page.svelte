<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Testimonial {
    id: string;
    name: string;
    content: string;
    rating: number;
    is_active: boolean;
    created_at: string;
  }

  let testimonials = $state<Testimonial[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadTestimonials();
  });

  async function loadTestimonials() {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');

      const data = await response.json();
      testimonials = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load testimonials';
    } finally {
      loading = false;
    }
  }

  async function toggleTestimonial(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`https://backend-nine-dun-99.vercel.app/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update testimonial');

      await loadTestimonials();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update testimonial');
    }
  }
</script>

<svelte:head>
  <title>Testimonials - Admin Dashboard</title>
</svelte:head>

<div class="testimonials-page">
  <div class="page-header">
    <h1>Testimonials</h1>
    <a href="/admin/testimonials/new" class="btn btn-primary">Add Testimonial</a>
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadTestimonials} />
  {:else if loading}
    <div class="loading-grid">
      {#each Array(6) as _}
        <SkeletonCard height="150px" />
      {/each}
    </div>
  {:else if testimonials.length === 0}
    <div class="empty-state">
      <div class="empty-icon">💬</div>
      <h2>No Testimonials Yet</h2>
      <p>Add client testimonials to showcase your services</p>
      <a href="/admin/testimonials/new" class="btn btn-primary">Add Testimonial</a>
    </div>
  {:else}
    <div class="testimonials-grid">
      {#each testimonials as testimonial}
        <div class="testimonial-card">
          <div class="testimonial-header">
            <h3>{testimonial.name}</h3>
            <span class="status-badge {testimonial.is_active ? 'active' : 'inactive'}">
              {testimonial.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p class="testimonial-content">"{testimonial.content}"</p>
          <div class="testimonial-footer">
            <span class="rating-badge">⭐ {testimonial.rating}/5</span>
            <div class="testimonial-actions">
              <a href={`/admin/testimonials/${testimonial.id}`} class="btn btn-sm">Edit</a>
              <button
                onclick={() => toggleTestimonial(testimonial.id, testimonial.is_active)}
                class="btn btn-sm btn-toggle"
              >
                {testimonial.is_active ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .testimonials-page {
    max-width: 1400px;
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

  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .testimonial-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
  }

  .testimonial-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .testimonial-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: var(--font-size-lg);
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  .testimonial-content {
    margin: 0 0 20px 0;
    color: var(--text-light);
    line-height: 1.6;
    font-style: italic;
  }

  .testimonial-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .rating-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .testimonial-actions {
    display: flex;
    gap: 8px;
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

    .testimonials-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

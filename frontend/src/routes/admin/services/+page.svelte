<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Service {
    id: string;
    title: string;
    short_description: string;
    is_active: boolean;
    created_at: string;
  }

  let services = $state<Service[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadServices();
  });

  async function loadServices() {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');

      const data = await response.json();
      services = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load services';
    } finally {
      loading = false;
    }
  }

  async function toggleService(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`https://backend-nine-dun-99.vercel.app/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update service');

      await loadServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update service');
    }
  }
</script>

<svelte:head>
  <title>Services - Admin Dashboard</title>
</svelte:head>

<div class="services-page">
  <div class="page-header">
    <h1>Services</h1>
    <a href="/admin/services/new" class="btn btn-primary">Add New Service</a>
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadServices} />
  {:else if loading}
    <div class="loading-grid">
      {#each Array(6) as _}
        <SkeletonCard height="200px" />
      {/each}
    </div>
  {:else if services.length === 0}
    <div class="empty-state">
      <div class="empty-icon">🛠️</div>
      <h2>No Services Yet</h2>
      <p>Create your first service to get started</p>
      <a href="/admin/services/new" class="btn btn-primary">Add Service</a>
    </div>
  {:else}
    <div class="services-grid">
      {#each services as service}
        <div class="service-card">
          <div class="service-header">
            <h3>{service.title}</h3>
            <span class="status-badge {service.is_active ? 'active' : 'inactive'}">
              {service.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p class="service-description">{service.short_description}</p>
          <div class="service-actions">
            <a href={`/admin/services/${service.id}`} class="btn btn-sm">Edit</a>
            <button
              onclick={() => toggleService(service.id, service.is_active)}
              class="btn btn-sm btn-toggle"
            >
              {service.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .services-page {
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .service-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-md);
    transition: var(--transition);
  }

  .service-card:hover {
    box-shadow: var(--shadow-lg);
  }

  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
  }

  .service-header h3 {
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

  .service-description {
    color: var(--text-light);
    margin: 0 0 20px 0;
    line-height: 1.6;
  }

  .service-actions {
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

    .services-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

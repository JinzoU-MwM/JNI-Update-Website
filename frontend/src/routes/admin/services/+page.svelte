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
  let searchQuery = $state('');

  $: filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Services</h1>
        <p>Manage your service offerings</p>
      </div>
    </div>
    <a href="/admin/services/new" class="btn btn-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Add Service</span>
    </a>
  </div>

  {#if !loading && !error && services.length > 0}
    <div class="search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder="Search services..."
        bind:value={searchQuery}
      />
      <span class="result-count">{filteredServices.length} of {services.length}</span>
    </div>
  {/if}

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
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      </div>
      <h2>No Services Yet</h2>
      <p>Create your first service to get started</p>
      <a href="/admin/services/new" class="btn btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span>Add Service</span>
      </a>
    </div>
  {:else if filteredServices.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h2>No Results Found</h2>
      <p>Try a different search term</p>
    </div>
  {:else}
    <div class="services-grid">
      {#each filteredServices as service}
        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span class="status-badge {service.is_active ? 'active' : 'inactive'}">
              {#if service.is_active}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              {:else}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              {/if}
              <span>{service.is_active ? 'Active' : 'Inactive'}</span>
            </span>
          </div>
          <h3 class="service-title">{service.title}</h3>
          <p class="service-description">{service.short_description}</p>
          <div class="service-footer">
            <a href={`/admin/services/${service.id}`} class="btn btn-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </a>
            <button
              onclick={() => toggleService(service.id, service.is_active)}
              class="btn btn-toggle {service.is_active ? 'deactivate' : 'activate'}"
            >
              {#if service.is_active}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                <span>Deactivate</span>
              {:else}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Activate</span>
              {/if}
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
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
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

  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 12px 18px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .search-bar svg {
    color: var(--text-light);
    flex-shrink: 0;
  }

  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: var(--text-dark);
  }

  .search-bar input::placeholder {
    color: var(--text-light);
  }

  .result-count {
    font-size: 0.75rem;
    color: var(--text-light);
    background: #f0f4f0;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
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
    color: var(--primary);
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .service-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .service-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .service-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .status-badge.active {
    background: rgba(56, 124, 68, 0.1);
    color: var(--primary);
  }

  .status-badge.inactive {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .service-title {
    margin: 0 0 8px 0;
    color: var(--text-dark);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .service-description {
    color: var(--text-light);
    margin: 0 0 20px 0;
    line-height: 1.6;
    font-size: 0.9rem;
    flex: 1;
  }

  .service-footer {
    display: flex;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
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
    flex: 1;
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
    flex: 1;
  }

  .btn-toggle.deactivate {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }

  .btn-toggle.deactivate:hover {
    background: rgba(239, 68, 68, 0.15);
  }

  .btn-toggle.activate {
    background: rgba(56, 124, 68, 0.08);
    color: var(--primary);
  }

  .btn-toggle.activate:hover {
    background: rgba(56, 124, 68, 0.15);
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 20px;
      align-items: stretch;
    }

    .header-content {
      justify-content: center;
    }

    .services-grid {
      grid-template-columns: 1fr;
    }

    .btn-primary {
      justify-content: center;
    }
  }
</style>

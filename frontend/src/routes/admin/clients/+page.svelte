<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Client {
    id: string;
    name: string;
    logo_path: string;
    is_active: boolean;
    display_order: number;
  }

  let clients = $state<Client[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadClients();
  });

  async function loadClients() {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');

      const data = await response.json();
      clients = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load clients';
    } finally {
      loading = false;
    }
  }

  async function toggleClient(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`https://backend-nine-dun-99.vercel.app/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update client');

      await loadClients();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update client');
    }
  }
</script>

<svelte:head>
  <title>Clients - Admin Dashboard</title>
</svelte:head>

<div class="clients-page">
  <div class="page-header">
    <h1>Clients</h1>
    <a href="/admin/clients/new" class="btn btn-primary">Add Client</a>
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadClients} />
  {:else if loading}
    <div class="loading-grid">
      {#each Array(12) as _}
        <SkeletonCard height="100px" />
      {/each}
    </div>
  {:else if clients.length === 0}
    <div class="empty-state">
      <div class="empty-icon">🏢</div>
      <h2>No Clients Yet</h2>
      <p>Add your client logos to showcase your partnerships</p>
      <a href="/admin/clients/new" class="btn btn-primary">Add Client</a>
    </div>
  {:else}
    <div class="clients-grid">
      {#each clients as client}
        <div class="client-card">
          <div class="client-header">
            <h3>{client.name}</h3>
            <span class="status-badge {client.is_active ? 'active' : 'inactive'}">
              {client.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <img
            src={client.logo_path}
            alt={client.name}
            class="client-logo"
            loading="lazy"
          />
          <div class="client-actions">
            <a href={`/admin/clients/${client.id}`} class="btn btn-sm">Edit</a>
            <button
              onclick={() => toggleClient(client.id, client.is_active)}
              class="btn btn-sm btn-toggle"
            >
              {client.is_active ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .clients-page {
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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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

  .clients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .client-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .client-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 8px;
  }

  .client-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: var(--font-size-sm);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 20px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  .client-logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin: 0 auto 16px;
    border-radius: var(--radius-md);
  }

  .client-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: auto;
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

    .clients-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>

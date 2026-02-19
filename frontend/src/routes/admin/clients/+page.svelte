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
  let searchQuery = $state('');

  $: filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  onMount(async () => { await loadClients(); });

  async function loadClients() {
    loading = true;
    error = '';
    try {
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      clients = await response.json();
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (!response.ok) throw new Error('Failed to update client');
      await loadClients();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update client');
    }
  }
</script>

<svelte:head><title>Clients - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Clients</h1>
        <p>Manage client logos and partnerships</p>
      </div>
    </div>
    <a href="/admin/clients/new" class="btn primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Add Client</span>
    </a>
  </div>

  {#if !loading && !error && clients.length > 0}
    <div class="search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" placeholder="Search clients..." bind:value={searchQuery} />
      <span class="count">{filteredClients.length} of {clients.length}</span>
    </div>
  {/if}

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={loadClients} />
  {:else if loading}
    <div class="loading-grid">{#each Array(8) as _}<SkeletonCard height="160px" />{/each}</div>
  {:else if clients.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        </svg>
      </div>
      <h2>No Clients Yet</h2>
      <p>Add your client logos to showcase partnerships</p>
      <a href="/admin/clients/new" class="btn primary">Add Client</a>
    </div>
  {:else}
    <div class="grid">
      {#each filteredClients as client}
        <div class="card">
          <div class="card-header">
            <span class="status {client.is_active ? 'active' : 'inactive'}">
              {#if client.is_active}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              {:else}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>{/if}
              {client.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div class="logo-wrap">
            <img src={client.logo_path} alt={client.name} loading="lazy" />
          </div>
          <h3>{client.name}</h3>
          <div class="actions">
            <a href={`/admin/clients/${client.id}`} class="btn edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </a>
            <button onclick={() => toggleClient(client.id, client.is_active)} class="btn toggle {client.is_active ? 'hide' : 'show'}">
              {#if client.is_active}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Hide
              {:else}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Show{/if}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page{max-width:1200px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}.header-content{display:flex;align-items:center;gap:16px}.header-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#f3e5f5 0%,#e1bee7 100%);color:#7b1fa2;display:flex;align-items:center;justify-content:center}.header-text h1{margin:0;font-size:1.5rem;font-weight:700}.header-text p{margin:4px 0 0;color:var(--text-light);font-size:0.9rem}.search-bar{display:flex;align-items:center;gap:12px;background:white;padding:12px 18px;border-radius:12px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.04)}.search-bar svg{color:var(--text-light)}.search-bar input{flex:1;border:none;outline:none;font-size:0.9rem}.count{font-size:0.75rem;color:var(--text-light);background:#f0f4f0;padding:4px 10px;border-radius:20px}.loading-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}.empty-state{text-align:center;padding:60px 20px;background:white;border-radius:20px}.empty-icon{width:100px;height:100px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#f0f4f0 0%,#e0e8e0 100%);display:flex;align-items:center;justify-content:center;color:var(--text-light)}.empty-state h2{margin:0 0 10px;font-size:1.25rem;font-weight:700}.empty-state p{margin:0 0 28px;color:var(--text-light)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}.card{background:white;border-radius:16px;padding:20px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.06);transition:all 0.3s ease}.card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,0.1)}.card-header{display:flex;justify-content:flex-end;margin-bottom:12px}.status{display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.7rem;font-weight:600}.status.active{background:rgba(56,124,68,0.1);color:var(--primary)}.status.inactive{background:rgba(239,68,68,0.1);color:#ef4444}.logo-wrap{width:80px;height:80px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center}.logo-wrap img{max-width:100%;max-height:100%;object-fit:contain}.card h3{margin:0 0 16px;font-size:0.95rem;font-weight:600;color:var(--text-dark)}.actions{display:flex;gap:8px}.btn{flex:1;padding:10px 12px;border:none;border-radius:10px;font-size:0.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;transition:all 0.2s}.btn.primary{background:linear-gradient(135deg,var(--primary) 0%,var(--primary-dark) 100%);color:white;box-shadow:0 4px 12px rgba(56,124,68,0.25)}.btn.primary:hover{transform:translateY(-2px)}.btn.edit{background:#f8faf8;color:var(--text);border:1px solid rgba(0,0,0,0.06)}.btn.edit:hover{border-color:var(--primary);color:var(--primary)}.btn.toggle{background:rgba(56,124,68,0.08);color:var(--primary)}.btn.toggle:hover{background:rgba(56,124,68,0.15)}.btn.toggle.hide{background:rgba(239,68,68,0.08);color:#ef4444}.btn.toggle.hide:hover{background:rgba(239,68,68,0.15)}@media(max-width:768px){.header{flex-direction:column;gap:20px}.grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}}
</style>

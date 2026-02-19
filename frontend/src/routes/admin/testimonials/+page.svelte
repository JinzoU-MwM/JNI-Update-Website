<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    rating: number;
    is_active: boolean;
  }

  let testimonials = $state<Testimonial[]>([]);
  let loading = $state(true);
  let error = $state('');
  let searchQuery = $state('');
  let filterStatus = $state<'all'|'active'|'inactive'>('all');

  $: filtered = testimonials.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' && t.is_active) || (filterStatus === 'inactive' && !t.is_active);
    return matchSearch && matchStatus;
  });

  onMount(async () => { await load(); });

  async function load() {
    loading = true; error = '';
    try {
      const res = await fetch('https://backend-nine-dun-99.vercel.app/api/testimonials');
      if (!res.ok) throw new Error('Failed to fetch');
      testimonials = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  async function toggle(id: string, status: boolean) {
    try {
      const res = await fetch(`https://backend-nine-dun-99.vercel.app/api/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !status }) });
      if (!res.ok) throw new Error('Failed');
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }
</script>

<svelte:head><title>Testimonials - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Testimonials</h1>
        <p>Client reviews and feedback</p>
      </div>
    </div>
    <a href="/admin/testimonials/new" class="btn primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Add Testimonial</span>
    </a>
  </div>

  {#if !loading && !error && testimonials.length > 0}
    <div class="filters">
      <div class="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search..." bind:value={searchQuery} />
      </div>
      <div class="filter-btns">
        <button class="fb" class:active={filterStatus==='all'} onclick={() => filterStatus='all'}>All</button>
        <button class="fb" class:active={filterStatus==='active'} onclick={() => filterStatus='active'}>Active</button>
        <button class="fb" class:active={filterStatus==='inactive'} onclick={() => filterStatus='inactive'}>Inactive</button>
      </div>
      <span class="count">{filtered.length}</span>
    </div>
  {/if}

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={load} />
  {:else if loading}
    <div class="loading">{#each Array(4) as _}<SkeletonCard height="180px" />{/each}</div>
  {:else if testimonials.length === 0}
    <div class="empty">
      <div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
      <h2>No Testimonials</h2>
      <p>Add client testimonials to showcase your services</p>
      <a href="/admin/testimonials/new" class="btn primary">Add Testimonial</a>
    </div>
  {:else}
    <div class="grid">
      {#each filtered as t}
        <div class="card">
          <div class="card-header">
            <div class="avatar">{t.name.charAt(0)}</div>
            <div class="info">
              <strong>{t.name}</strong>
              {#if t.role || t.company}<span>{t.role}{t.role && t.company ? ' at ' : ''}{t.company}</span>{/if}
            </div>
            <span class="status {t.is_active ? 'active' : 'inactive'}">{t.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <p class="content">"{t.content}"</p>
          <div class="card-footer">
            <div class="rating">{#each Array(5) as _, i}<span class:filled={i < t.rating}>★</span>{/each}</div>
            <div class="actions">
              <a href={`/admin/testimonials/${t.id}`} class="btn edit">Edit</a>
              <button onclick={() => toggle(t.id, t.is_active)} class="btn toggle">{t.is_active ? 'Hide' : 'Show'}</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page{max-width:1200px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}.header-content{display:flex;align-items:center;gap:16px}.header-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#fff3e0 0%,#ffe0b2 100%);color:#ef6c00;display:flex;align-items:center;justify-content:center}.header-text h1{margin:0;font-size:1.5rem;font-weight:700}.header-text p{margin:4px 0 0;color:var(--text-light);font-size:0.9rem}.filters{display:flex;align-items:center;gap:16px;background:white;padding:12px 18px;border-radius:12px;margin-bottom:20px;flex-wrap:wrap}.search{display:flex;align-items:center;gap:10px;flex:1;min-width:200px}.search svg{color:var(--text-light)}.search input{border:none;outline:none;font-size:0.9rem;width:100%}.filter-btns{display:flex;gap:6px}.fb{padding:6px 14px;border:none;border-radius:8px;background:transparent;color:var(--text-light);font-size:0.8rem;font-weight:600;cursor:pointer}.fb:hover{background:#f0f4f0}.fb.active{background:var(--primary);color:white}.count{font-size:0.75rem;color:var(--text-light);background:#f0f4f0;padding:4px 10px;border-radius:20px}.loading{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:16px}.empty{text-align:center;padding:60px 20px;background:white;border-radius:20px}.empty-icon{width:100px;height:100px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#f0f4f0 0%,#e0e8e0 100%);display:flex;align-items:center;justify-content:center;color:var(--text-light)}.empty h2{margin:0 0 10px;font-size:1.25rem}.empty p{margin:0 0 28px;color:var(--text-light)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:16px}.card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);transition:all 0.3s}.card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.1)}.card-header{display:flex;align-items:center;gap:12px;margin-bottom:16px}.avatar{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--primary),#2d6a37);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem}.info{flex:1;display:flex;flex-direction:column}.info strong{font-size:1rem;color:var(--text-dark)}.info span{font-size:0.75rem;color:var(--text-light)}.status{padding:4px 10px;border-radius:20px;font-size:0.7rem;font-weight:600}.status.active{background:rgba(56,124,68,0.1);color:var(--primary)}.status.inactive{background:rgba(239,68,68,0.1);color:#ef4444}.content{margin:0 0 16px;color:var(--text-light);font-style:italic;line-height:1.6;font-size:0.9rem}.card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid rgba(0,0,0,0.06)}.rating span{color:#d1d5db;font-size:1rem}.rating span.filled{color:#fbbf24}.actions{display:flex;gap:8px}.btn{padding:8px 14px;border:none;border-radius:8px;font-size:0.8rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s}.btn.primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;box-shadow:0 4px 12px rgba(56,124,68,0.25)}.btn.edit{background:#f8faf8;color:var(--text);border:1px solid rgba(0,0,0,0.06)}.btn.edit:hover{border-color:var(--primary);color:var(--primary)}.btn.toggle{background:rgba(56,124,68,0.08);color:var(--primary)}.btn.toggle:hover{background:rgba(56,124,68,0.15)}@media(max-width:768px){.header{flex-direction:column;gap:20px}.grid{grid-template-columns:1fr}.filters{flex-direction:column;align-items:stretch}.filter-btns{justify-content:center}}
</style>

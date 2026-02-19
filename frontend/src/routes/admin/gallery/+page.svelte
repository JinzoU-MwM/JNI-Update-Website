<script lang="ts">
  import { onMount } from 'svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  interface Item { id: string; title: string; image_url: string; category: string; }

  let gallery = $state<Item[]>([]);
  let categories = $state<string[]>(['all']);
  let selected = $state('all');
  let loading = $state(true);
  let error = $state('');

  onMount(async () => { await load(); });

  async function load() {
    loading = true; error = '';
    try {
      let url = 'https://backend-nine-dun-99.vercel.app/api/gallery';
      if (selected !== 'all') url += `?category=${encodeURIComponent(selected)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      gallery = data.items || [];
      if (data.categories?.length) categories = ['all', ...data.categories];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  $effect(() => { if (selected) load(); });

  async function deleteItem(id: string) {
    if (!confirm('Delete this photo?')) return;
    try {
      const res = await fetch(`https://backend-nine-dun-99.vercel.app/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }
</script>

<svelte:head><title>Gallery - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Gallery</h1>
        <p>Project photos and media</p>
      </div>
    </div>
    <a href="/admin/gallery/new" class="btn primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Add Photo</span>
    </a>
  </div>

  <div class="filters">
    {#each categories as cat}
      <button class="cat-btn" class:active={selected === cat} onclick={() => selected = cat}>{cat}</button>
    {/each}
  </div>

  {#if error}
    <ErrorMessage title="Error" message={error} onRetry={load} />
  {:else if loading}
    <div class="loading">{#each Array(8) as _}<SkeletonCard height="220px" />{/each}</div>
  {:else if gallery.length === 0}
    <div class="empty">
      <div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
      <h2>No Photos</h2>
      <p>Add photos to showcase your work</p>
      <a href="/admin/gallery/new" class="btn primary">Add Photo</a>
    </div>
  {:else}
    <div class="grid">
      {#each gallery as item}
        <div class="card">
          <div class="img-wrap">
            <img src={item.image_url} alt={item.title || 'Photo'} loading="lazy" />
            <div class="overlay">
              <button onclick={() => deleteItem(item.id)} class="btn del">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
          <div class="info">
            <h3>{item.title || 'Untitled'}</h3>
            <span class="cat">{item.category}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page{max-width:1400px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.header-content{display:flex;align-items:center;gap:16px}.header-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%);color:#2e7d32;display:flex;align-items:center;justify-content:center}.header-text h1{margin:0;font-size:1.5rem;font-weight:700}.header-text p{margin:4px 0 0;color:var(--text-light);font-size:0.9rem}.filters{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}.cat-btn{padding:8px 18px;border:2px solid rgba(0,0,0,0.08);border-radius:10px;background:white;color:var(--text);font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s}.cat-btn:hover{border-color:var(--primary)}.cat-btn.active{background:var(--primary);border-color:var(--primary);color:white}.loading{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px}.empty{text-align:center;padding:60px 20px;background:white;border-radius:20px}.empty-icon{width:100px;height:100px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#f0f4f0,#e0e8e0);display:flex;align-items:center;justify-content:center;color:var(--text-light)}.empty h2{margin:0 0 10px;font-size:1.25rem}.empty p{margin:0 0 28px;color:var(--text-light)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px}.card{background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);transition:all 0.3s}.card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,0.1)}.img-wrap{position:relative;aspect-ratio:4/3;overflow:hidden}.img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s}.card:hover .img-wrap img{transform:scale(1.05)}.overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s}.card:hover .overlay{opacity:1}.btn.del{background:#ef4444;color:white;border:none;padding:10px 18px;border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.2s}.btn.del:hover{background:#dc2626;transform:scale(1.05)}.info{padding:16px}.info h3{margin:0 0 8px;font-size:0.95rem;font-weight:600}.cat{display:inline-block;background:rgba(0,0,0,0.05);color:var(--text);padding:4px 10px;border-radius:20px;font-size:0.7rem;font-weight:600}.btn.primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;box-shadow:0 4px 12px rgba(56,124,68,0.25);padding:12px 20px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;text-decoration:none;transition:all 0.2s}.btn.primary:hover{transform:translateY(-2px)}@media(max-width:768px){.header{flex-direction:column;gap:20px}.grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
</style>

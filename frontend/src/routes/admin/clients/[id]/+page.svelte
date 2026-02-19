<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let form = $state({ name: '', logo_path: '', display_order: 0, is_active: false });
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let clientId = $derived($page.params.id);

  onMount(async () => {
    try {
      const res = await fetch(`https://backend-nine-dun-99.vercel.app/api/clients/${clientId}`);
      if (!res.ok) throw new Error('Failed to load client');
      const data = await res.json();
      form = { name: data.name, logo_path: data.logo_path, display_order: data.display_order || 0, is_active: data.is_active };
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load client';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    error = '';
    try {
      const res = await fetch(`https://backend-nine-dun-99.vercel.app/api/clients/${clientId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to update client');
      goto('/admin/clients');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update client';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head><title>Edit Client - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <a href="/admin/clients" class="back-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Clients</a>
    <h1>Edit Client</h1>
  </div>
  {#if loading}<div class="loading">Loading...</div>
  {:else if error && !form.name}<div class="error-state"><h2>Client not found</h2><a href="/admin/clients" class="btn primary">Back</a></div>
  {:else}
    {#if error}<div class="alert error">{error}</div>{/if}
    <form onsubmit={handleSubmit} class="form">
      <div class="form-group"><label>Client Name *</label><input type="text" bind:value={form.name} required /></div>
      <div class="form-group"><label>Logo URL *</label><input type="url" bind:value={form.logo_path} required /></div>
      {#if form.logo_path}<div class="preview"><img src={form.logo_path} alt="Preview" onerror="this.style.display='none'" /></div>{/if}
      <div class="form-group"><label>Display Order</label><input type="number" bind:value={form.display_order} min="0" /></div>
      <div class="form-group"><label class="checkbox"><input type="checkbox" bind:checked={form.is_active} /><span>Active</span></label></div>
      <div class="actions"><button type="button" class="btn secondary" onclick={() => goto('/admin/clients')}>Cancel</button><button type="submit" class="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
    </form>
  {/if}
</div>

<style>
  .page{max-width:600px;margin:0 auto}.header{margin-bottom:28px}.back-link{display:inline-flex;align-items:center;gap:8px;color:var(--text-light);text-decoration:none;font-size:0.875rem;margin-bottom:16px}.back-link:hover{color:var(--primary)}h1{margin:0;font-size:1.5rem;font-weight:700}.loading{padding:60px;text-align:center;color:var(--text-light)}.error-state{text-align:center;padding:60px 20px;background:white;border-radius:16px}.alert{padding:14px 18px;border-radius:12px;margin-bottom:20px}.alert.error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}.form{background:white;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}.form-group{margin-bottom:20px}.form-group label{display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem}.form-group input{width:100%;padding:12px 14px;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;background:#f8faf8}.form-group input:focus{outline:none;border-color:var(--primary);background:white}.preview{margin-bottom:20px;padding:20px;background:#f8faf8;border-radius:12px;text-align:center}.preview img{max-width:150px;max-height:80px;object-fit:contain}.checkbox{display:flex;align-items:center;gap:10px;cursor:pointer}.checkbox input{width:18px;height:18px;accent-color:var(--primary)}.actions{display:flex;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(0,0,0,0.06)}.btn{padding:12px 24px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none}.btn.primary{background:var(--primary);color:white}.btn.secondary{background:#f0f4f0;color:var(--text)}.btn:disabled{opacity:0.6}
</style>

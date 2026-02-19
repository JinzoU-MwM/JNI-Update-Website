<script lang="ts">
  import { goto } from '$app/navigation';

  let form = $state({ name: '', role: '', company: '', content: '', rating: 5, is_active: true });
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    try {
      const res = await fetch('https://backend-nine-dun-99.vercel.app/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to create testimonial');
      goto('/admin/testimonials');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create testimonial';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head><title>New Testimonial - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <a href="/admin/testimonials" class="back-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Testimonials</a>
    <h1>Add New Testimonial</h1>
  </div>
  {#if error}<div class="alert error">{error}</div>{/if}
  <form onsubmit={handleSubmit} class="form">
    <div class="form-row">
      <div class="form-group"><label>Name *</label><input type="text" bind:value={form.name} required placeholder="Client name" /></div>
      <div class="form-group"><label>Role</label><input type="text" bind:value={form.role} placeholder="e.g. CEO" /></div>
    </div>
    <div class="form-group"><label>Company</label><input type="text" bind:value={form.company} placeholder="Company name" /></div>
    <div class="form-group"><label>Testimonial *</label><textarea bind:value={form.content} rows="4" required placeholder="What did they say..."></textarea></div>
    <div class="form-group"><label>Rating *</label>
      <div class="rating">{#each [1,2,3,4,5] as i}<button type="button" class="star" class:active={i <= form.rating} onclick={() => form.rating = i}>★</button>{/each}</div>
    </div>
    <div class="form-group"><label class="checkbox"><input type="checkbox" bind:checked={form.is_active} /><span>Active</span></label></div>
    <div class="actions"><button type="button" class="btn secondary" onclick={() => goto('/admin/testimonials')}>Cancel</button><button type="submit" class="btn primary" disabled={loading}>{loading ? 'Adding...' : 'Add Testimonial'}</button></div>
  </form>
</div>

<style>
  .page{max-width:700px;margin:0 auto}.header{margin-bottom:28px}.back-link{display:inline-flex;align-items:center;gap:8px;color:var(--text-light);text-decoration:none;font-size:0.875rem;margin-bottom:16px}.back-link:hover{color:var(--primary)}h1{margin:0;font-size:1.5rem;font-weight:700}.alert{padding:14px 18px;border-radius:12px;margin-bottom:20px}.alert.error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}.form{background:white;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}.form-group{margin-bottom:20px}.form-group label{display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem}.form-group input,.form-group textarea{width:100%;padding:12px 14px;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;background:#f8faf8}.form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--primary);background:white}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}.rating{display:flex;gap:4px}.star{background:none;border:none;font-size:1.5rem;color:#d1d5db;cursor:pointer;transition:color 0.2s}.star.active{color:#fbbf24}.checkbox{display:flex;align-items:center;gap:10px;cursor:pointer}.checkbox input{width:18px;height:18px;accent-color:var(--primary)}.actions{display:flex;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(0,0,0,0.06)}.btn{padding:12px 24px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer}.btn.primary{background:var(--primary);color:white}.btn.secondary{background:#f0f4f0;color:var(--text)}.btn:disabled{opacity:0.6}@media(max-width:640px){.form-row{grid-template-columns:1fr}}
</style>

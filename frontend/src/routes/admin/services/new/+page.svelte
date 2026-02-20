<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminPost } from '$lib/api/admin';

  interface FormData {
    title: string;
    short_description: string;
    full_description: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
  }

  let form = $state<FormData>({
    title: '',
    short_description: '',
    full_description: '',
    icon_name: '',
    display_order: 0,
    is_active: true
  });

  let loading = $state(false);
  let error = $state('');

  const icons = ['briefcase', 'users', 'trending-up', 'shield', 'target', 'lightbulb', 'settings', 'award'];

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await adminPost('/services', form);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create service');
      }

      goto('/admin/services');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create service';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>New Service - Admin</title>
</svelte:head>

<div class="page">
  <div class="header">
    <a href="/admin/services" class="back-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Services
    </a>
    <h1>Add New Service</h1>
  </div>

  {#if error}
    <div class="alert error">{error}</div>
  {/if}

  <form onsubmit={handleSubmit} class="form">
    <div class="form-group">
      <label>Title *</label>
      <input type="text" bind:value={form.title} required placeholder="Service title" />
    </div>

    <div class="form-group">
      <label>Short Description *</label>
      <input type="text" bind:value={form.short_description} required placeholder="Brief description" />
    </div>

    <div class="form-group">
      <label>Full Description *</label>
      <textarea bind:value={form.full_description} rows="6" required placeholder="Detailed description..."></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Icon</label>
        <select bind:value={form.icon_name}>
          <option value="">Select icon</option>
          {#each icons as icon}
            <option value={icon}>{icon}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label>Display Order</label>
        <input type="number" bind:value={form.display_order} min="0" />
      </div>
    </div>

    <div class="form-group">
      <label class="checkbox">
        <input type="checkbox" bind:checked={form.is_active} />
        <span>Active</span>
      </label>
    </div>

    <div class="actions">
      <button type="button" class="btn secondary" onclick={() => goto('/admin/services')}>Cancel</button>
      <button type="submit" class="btn primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Service'}
      </button>
    </div>
  </form>
</div>

<style>
  .page { max-width: 800px; margin: 0 auto; }
  .header { margin-bottom: 28px; }
  .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-light); text-decoration: none; font-size: 0.875rem; margin-bottom: 16px; }
  .back-link:hover { color: var(--primary); }
  h1 { margin: 0; font-size: 1.5rem; font-weight: 700; }
  .alert { padding: 14px 18px; border-radius: 12px; margin-bottom: 20px; }
  .alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .form { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.875rem; }
  .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px 14px; border: 2px solid rgba(0,0,0,0.08); border-radius: 10px; font-size: 0.95rem; background: #f8faf8; }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: var(--primary); background: white; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .checkbox input { width: 18px; height: 18px; accent-color: var(--primary); }
  .actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.06); }
  .btn { padding: 12px 24px; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
  .btn.primary { background: var(--primary); color: white; }
  .btn.primary:hover { background: var(--primary-dark); }
  .btn.secondary { background: #f0f4f0; color: var(--text); }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>

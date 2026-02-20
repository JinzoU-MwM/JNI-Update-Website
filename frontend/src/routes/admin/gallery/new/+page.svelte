<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminPost, adminUploadFile } from '$lib/api/admin';

  let form = $state({ title: '', image_url: '', category: '' });
  let loading = $state(false);
  let error = $state('');
  let selectedFile: File | null = $state(null);
  let preview = $state('');
  let uploadProgress = $state('');

  const categories = ['Project', 'Event', 'Team', 'Office', 'Award', 'Other'];

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
      preview = URL.createObjectURL(input.files[0]);
      form.image_url = ''; // Clear URL when file is selected
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    uploadProgress = '';

    try {
      // If file selected, upload it first
      if (selectedFile) {
        uploadProgress = 'Uploading image...';
        const result = await adminUploadFile(selectedFile, 'gallery');
        form.image_url = result.path;
        uploadProgress = 'Saving to gallery...';
      }

      if (!form.image_url) {
        throw new Error('Please select a file or enter an image URL');
      }

      const res = await adminPost('/gallery', form);
      if (!res.ok) throw new Error('Failed to save');
      goto('/admin/gallery');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to upload';
    } finally {
      loading = false;
      uploadProgress = '';
    }
  }
</script>

<svelte:head><title>Add Photo - Admin</title></svelte:head>

<div class="page">
  <div class="header">
    <a href="/admin/gallery" class="back-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Gallery</a>
    <h1>Add New Photo</h1>
  </div>
  {#if error}<div class="alert error">{error}</div>{/if}
  <form onsubmit={handleSubmit} class="form">
    <div class="form-group"><label>Title</label><input type="text" bind:value={form.title} placeholder="Photo title (optional)" /></div>

    <div class="form-group">
      <label>Image File *</label>
      <div class="file-input-wrapper">
        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onchange={handleFileSelect} class="file-input" />
        <div class="file-input-display">
          {#if selectedFile}
            <span class="file-name">{selectedFile.name}</span>
            <button type="button" class="clear-btn" onclick={() => { selectedFile = null; preview = ''; }}>Clear</button>
          {:else}
            <span class="file-placeholder">Click to select an image (JPEG, PNG, GIF, WebP - max 5MB)</span>
          {/if}
        </div>
      </div>
    </div>

    <div class="divider"><span>OR</span></div>

    <div class="form-group"><label>Image URL</label><input type="url" bind:value={form.image_url} placeholder="https://example.com/image.jpg" disabled={!!selectedFile} /></div>

    {#if preview || form.image_url}<div class="preview"><img src={preview || form.image_url} alt="Preview" onerror={(e) => e.currentTarget.style.opacity='0.3'} /></div>{/if}

    <div class="form-group"><label>Category *</label>
      <select bind:value={form.category} required>
        <option value="">Select category</option>
        {#each categories as cat}<option value={cat}>{cat}</option>{/each}
      </select>
    </div>
    {#if uploadProgress}<div class="upload-progress">{uploadProgress}</div>{/if}
    <div class="actions"><button type="button" class="btn secondary" onclick={() => goto('/admin/gallery')}>Cancel</button><button type="submit" class="btn primary" disabled={loading}>{loading ? 'Adding...' : 'Add Photo'}</button></div>
  </form>
</div>

<style>
  .page{max-width:600px;margin:0 auto}.header{margin-bottom:28px}.back-link{display:inline-flex;align-items:center;gap:8px;color:var(--text-light);text-decoration:none;font-size:0.875rem;margin-bottom:16px}.back-link:hover{color:var(--primary)}h1{margin:0;font-size:1.5rem;font-weight:700}.alert{padding:14px 18px;border-radius:12px;margin-bottom:20px}.alert.error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}.form{background:white;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}.form-group{margin-bottom:20px}.form-group label{display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem}.form-group input,.form-group select{width:100%;padding:12px 14px;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;background:#f8faf8}.form-group input:focus,.form-group select:focus{outline:none;border-color:var(--primary);background:white}.form-group input:disabled{opacity:0.5;cursor:not-allowed}.file-input-wrapper{position:relative}.file-input{position:absolute;inset:0;opacity:0;cursor:pointer}.file-input-display{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:2px dashed rgba(0,0,0,0.15);border-radius:10px;background:#f8faf8;min-height:50px}.file-input-display:hover{border-color:var(--primary);background:#f0f8f0}.file-placeholder{color:var(--text-light);font-size:0.9rem}.file-name{color:var(--text);font-weight:500}.clear-btn{padding:4px 10px;background:#ef4444;color:white;border:none;border-radius:6px;font-size:0.75rem;cursor:pointer}.clear-btn:hover{background:#dc2626}.divider{display:flex;align-items:center;gap:16px;margin:20px 0;color:var(--text-light);font-size:0.85rem}.divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(0,0,0,0.1)}.preview{margin-bottom:20px;border-radius:12px;overflow:hidden;background:#f8faf8}.preview img{width:100%;max-height:300px;object-fit:cover}.upload-progress{padding:10px 14px;background:#e0f2fe;color:#0369a1;border-radius:8px;margin-bottom:20px;font-size:0.9rem;text-align:center}.actions{display:flex;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(0,0,0,0.06)}.btn{padding:12px 24px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer}.btn.primary{background:var(--primary);color:white}.btn.secondary{background:#f0f4f0;color:var(--text)}.btn:disabled{opacity:0.6}
</style>

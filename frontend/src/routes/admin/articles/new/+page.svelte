<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminPost, adminUploadFile } from '$lib/api/admin';
  import RichEditor from '$lib/components/RichEditor.svelte';

  interface FormData {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    featured_image_url: string;
    is_published: boolean;
  }

  let form = $state<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    featured_image_url: '',
    is_published: false
  });

  let loading = $state(false);
  let error = $state('');
  let selectedFile: File | null = $state(null);
  let preview = $state('');
  let uploadProgress = $state('');

  const categories = [
    'Business Strategy',
    'Digital Marketing',
    'Financial Planning',
    'Leadership',
    'Operations',
    'Technology',
    'Other'
  ];

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
      preview = URL.createObjectURL(input.files[0]);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    uploadProgress = '';

    try {
      if (selectedFile) {
        uploadProgress = 'Uploading image...';
        const result = await adminUploadFile(selectedFile, 'articles');
        form.featured_image_url = result.path;
        uploadProgress = 'Saving article...';
      }

      const response = await adminPost('/articles', form);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create article');
      }

      goto('/admin/articles');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create article';
    } finally {
      loading = false;
      uploadProgress = '';
    }
  }

  function handleCancel() {
    goto('/admin/articles');
  }
</script>

<svelte:head>
  <title>Write Article - Admin Dashboard</title>
</svelte:head>

<div class="article-editor">
  <div class="editor-header">
    <div class="header-content">
      <a href="/admin/articles" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Articles</span>
      </a>
      <h1>Write New Article</h1>
      <p>Create and publish a new article for your blog</p>
    </div>
  </div>

  {#if error}
    <div class="alert alert-error">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  {#if uploadProgress}
    <div class="alert alert-info">
      <div class="spinner"></div>
      <span>{uploadProgress}</span>
    </div>
  {/if}

  <form onsubmit={handleSubmit} class="editor-form">
    <div class="form-main">
      <div class="form-group">
        <label for="title">Article Title *</label>
        <input
          type="text"
          id="title"
          bind:value={form.title}
          required
          placeholder="Enter an engaging title..."
        />
      </div>

      <div class="form-group">
        <label for="excerpt">Excerpt *</label>
        <textarea
          id="excerpt"
          bind:value={form.excerpt}
          rows="3"
          required
          placeholder="Write a brief summary that will appear in article previews..."
        ></textarea>
        <span class="field-hint">This will be shown in article listings and search results</span>
      </div>

      <div class="form-group">
        <label>Content *</label>
        <RichEditor bind:value={form.content} onchange={(v) => form.content = v} />
      </div>
    </div>

    <div class="form-sidebar">
      <div class="sidebar-card">
        <h3>Publish</h3>
        <div class="publish-options">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={form.is_published} />
            <span class="checkmark"></span>
            <span>Publish immediately</span>
          </label>
          <p class="option-hint">If unchecked, the article will be saved as a draft</p>
        </div>
        <div class="sidebar-actions">
          <button type="button" class="btn btn-secondary" onclick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" disabled={loading}>
            {#if loading}
              <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span>Saving...</span>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>Save Article</span>
            {/if}
          </button>
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Category</h3>
        <div class="form-group no-gap">
          <select bind:value={form.category} required>
            <option value="" disabled>Select a category</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Author</h3>
        <div class="form-group no-gap">
          <input
            type="text"
            bind:value={form.author}
            placeholder="Author name"
            required
          />
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Featured Image</h3>
        <div class="file-upload-area">
          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onchange={handleFileSelect} class="file-input" />
          <div class="upload-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Click to upload image</span>
            <small>JPEG, PNG, GIF, WebP (max 5MB)</small>
          </div>
        </div>
        {#if selectedFile || form.featured_image_url}
          <div class="image-preview">
            <img src={preview || form.featured_image_url} alt="Preview" onerror={(e) => e.currentTarget.style.display='none'} />
            <button type="button" class="remove-btn" onclick={() => { selectedFile = null; preview = ''; form.featured_image_url = ''; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </form>
</div>

<style>
  .article-editor {
    max-width: 1400px;
    margin: 0 auto;
  }

  .editor-header {
    margin-bottom: 28px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 16px;
    transition: all 0.2s ease;
    padding: 8px 12px;
    border-radius: 8px;
  }

  .back-link:hover {
    color: var(--primary);
    background: rgba(56, 124, 68, 0.08);
  }

  .editor-header h1 {
    margin: 0 0 8px 0;
    color: var(--text-dark);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .editor-header p {
    margin: 0;
    color: var(--text-light);
  }

  .alert {
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .alert-info {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #2563eb;
  }

  .alert-info .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .editor-form {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    align-items: start;
  }

  .form-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 32px;
  }

  .sidebar-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .sidebar-card h3 {
    margin: 0 0 16px 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group.no-gap {
    gap: 0;
  }

  .form-group label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-dark);
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;
    background: #f8faf8;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px rgba(56, 124, 68, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 44px;
  }

  .field-hint {
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .publish-options {
    margin-bottom: 20px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .checkbox-label input {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
  }

  .option-hint {
    margin: 8px 0 0 28px;
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .sidebar-actions {
    display: flex;
    gap: 10px;
  }

  .btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.25);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(56, 124, 68, 0.3);
  }

  .btn-secondary {
    background: #f0f4f0;
    color: var(--text);
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e0e8e0;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  /* File Upload */
  .file-upload-area {
    position: relative;
    border: 2px dashed rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-upload-area:hover {
    border-color: var(--primary);
    background: rgba(56, 124, 68, 0.02);
  }

  .file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--text-light);
    text-align: center;
  }

  .upload-placeholder svg {
    margin-bottom: 8px;
    color: var(--text-light);
  }

  .upload-placeholder span {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text);
  }

  .upload-placeholder small {
    font-size: 0.7rem;
    margin-top: 4px;
  }

  .image-preview {
    margin-top: 12px;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f4f0;
    position: relative;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    display: block;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .remove-btn:hover {
    background: #ef4444;
  }

  @media (max-width: 1024px) {
    .editor-form {
      grid-template-columns: 1fr;
    }

    .form-sidebar {
      position: static;
      order: -1;
    }
  }

  @media (max-width: 640px) {
    .sidebar-actions {
      flex-direction: column;
    }
  }
</style>

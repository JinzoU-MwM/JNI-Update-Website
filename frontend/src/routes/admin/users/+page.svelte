<script lang="ts">
  import { onMount } from 'svelte';
  import { adminGet, adminPost, adminPut, adminDelete } from '$lib/api/admin';
  import { toasts } from '$lib/stores/toasts';
  import { confirmDialog } from '$lib/stores/confirm';
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';

  interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor';
    is_active: boolean;
    last_login: string | null;
    created_at: string;
  }

  let users = $state<User[]>([]);
  let loading = $state(true);
  let error = $state('');

  // New user form
  let showForm = $state(false);
  let saving = $state(false);
  let form = $state({
    username: '',
    email: '',
    password: '',
    role: 'editor'
  });

  // Editing user
  let editingUser = $state<User | null>(null);
  let editForm = $state({
    username: '',
    email: '',
    password: '',
    role: '',
    is_active: true
  });

  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    loading = true;
    error = '';
    try {
      const res = await adminGet('/users');
      if (!res.ok) throw new Error('Failed to load users');
      users = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load users';
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;

    try {
      const res = await adminPost('/users', form);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create user');
      }
      toasts.success('User created successfully');
      showForm = false;
      form = { username: '', email: '', password: '', role: 'editor' };
      await loadUsers();
    } catch (err) {
      toasts.error(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      saving = false;
    }
  }

  function startEdit(user: User) {
    editingUser = user;
    editForm = {
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active
    };
  }

  async function handleUpdate(e: Event) {
    e.preventDefault();
    if (!editingUser) return;

    saving = true;
    try {
      const updateData: Record<string, unknown> = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role,
        is_active: editForm.is_active
      };

      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const res = await adminPut(`/users/${editingUser.id}`, updateData);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update user');
      }
      toasts.success('User updated successfully');
      editingUser = null;
      await loadUsers();
    } catch (err) {
      toasts.error(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      saving = false;
    }
  }

  async function deleteUser(user: User) {
    const confirmed = await confirmDialog.show({
      title: 'Hapus User',
      message: `Apakah Anda yakin ingin menghapus user "${user.username}"?`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      const res = await adminDelete(`/users/${user.id}`);
      if (!res.ok) throw new Error('Failed to delete user');
      toasts.success('User deleted successfully');
      await loadUsers();
    } catch (err) {
      toasts.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head><title>Users - Admin</title></svelte:head>

<ConfirmDialog
  open={confirmDialog.state.open}
  title={confirmDialog.state.title}
  message={confirmDialog.state.message}
  confirmText={confirmDialog.state.confirmText}
  cancelText={confirmDialog.state.cancelText}
  variant={confirmDialog.state.variant}
  onconfirm={confirmDialog.confirm}
  oncancel={confirmDialog.cancel}
/>

<div class="page">
  <div class="header">
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Users</h1>
        <p>Manage admin accounts</p>
      </div>
    </div>
    <button class="btn primary" onclick={() => showForm = !showForm}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>{showForm ? 'Cancel' : 'Add User'}</span>
    </button>
  </div>

  {#if showForm}
    <form onsubmit={handleSubmit} class="form-card">
      <h3>Add New User</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Username *</label>
          <input type="text" bind:value={form.username} required placeholder="Enter username" />
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" bind:value={form.email} required placeholder="Enter email" />
        </div>
        <div class="form-group">
          <label>Password *</label>
          <input type="password" bind:value={form.password} required minlength={6} placeholder="Min 6 characters" />
        </div>
        <div class="form-group">
          <label>Role *</label>
          <select bind:value={form.role} required>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn secondary" onclick={() => showForm = false}>Cancel</button>
        <button type="submit" class="btn primary" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
      </div>
    </form>
  {/if}

  {#if editingUser}
    <form onsubmit={handleUpdate} class="form-card">
      <h3>Edit User: {editingUser.username}</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Username *</label>
          <input type="text" bind:value={editForm.username} required />
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" bind:value={editForm.email} required />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" bind:value={editForm.password} placeholder="Leave blank to keep current" minlength={6} />
        </div>
        <div class="form-group">
          <label>Role *</label>
          <select bind:value={editForm.role} required>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="form-group checkbox-group">
        <label class="checkbox">
          <input type="checkbox" bind:checked={editForm.is_active} />
          <span>Active</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn secondary" onclick={() => editingUser = null}>Cancel</button>
        <button type="submit" class="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  {/if}

  {#if error}
    <div class="alert error">{error}</div>
  {:else if loading}
    <div class="loading">Loading users...</div>
  {:else if users.length === 0}
    <div class="empty">
      <div class="empty-icon">👥</div>
      <h2>No Users</h2>
      <p>Add admin users to manage the website</p>
    </div>
  {:else}
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td><strong>{user.username}</strong></td>
              <td>{user.email}</td>
              <td>
                <span class="badge" class:admin={user.role === 'admin'}>{user.role}</span>
              </td>
              <td>
                <span class="status" class:active={user.is_active} class:inactive={!user.is_active}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{user.last_login ? formatDate(user.last_login) : 'Never'}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon" onclick={() => startEdit(user)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn-icon danger" onclick={() => deleteUser(user)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page{max-width:1000px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.header-content{display:flex;align-items:center;gap:16px}.header-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%);color:#2e7d32;display:flex;align-items:center;justify-content:center}.header-text h1{margin:0;font-size:1.5rem;font-weight:700}.header-text p{margin:4px 0 0;color:var(--text-light);font-size:0.9rem}.form-card{background:white;border-radius:16px;padding:28px;margin-bottom:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}.form-card h3{margin:0 0 20px;font-size:1.1rem;font-weight:600}.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}.form-group{display:flex;flex-direction:column;gap:6px}.form-group label{font-size:0.85rem;font-weight:600;color:var(--text-dark)}.form-group input,.form-group select{padding:12px 14px;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;background:#f8faf8;transition:all 0.2s}.form-group input:focus,.form-group select:focus{outline:none;border-color:var(--primary);background:white}.checkbox-group{margin-top:8px}.checkbox{display:flex;align-items:center;gap:10px;cursor:pointer}.checkbox input{width:18px;height:18px;accent-color:var(--primary)}.form-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:24px;padding-top:20px;border-top:1px solid rgba(0,0,0,0.06)}.btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.2s}.btn.primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white}.btn.primary:hover:not(:disabled){transform:translateY(-1px)}.btn.secondary{background:#f0f4f0;color:var(--text)}.btn.secondary:hover{background:#e0e8e0}.btn:disabled{opacity:0.6;cursor:not-allowed}.alert{padding:16px;border-radius:12px;margin-bottom:20px}.alert.error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}.loading{text-align:center;padding:40px;color:var(--text-light)}.empty{text-align:center;padding:60px 20px;background:white;border-radius:20px}.empty-icon{font-size:4rem;margin-bottom:16px}.empty h2{margin:0 0 8px}.empty p{margin:0;color:var(--text-light)}.table-wrapper{background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06)}.table{width:100%;border-collapse:collapse}.table th,.table td{padding:16px;text-align:left;border-bottom:1px solid #f0f4f0}.table th{background:#f8faf8;font-size:0.8rem;font-weight:700;text-transform:uppercase;color:var(--text-light);letter-spacing:0.05em}.table td{font-size:0.9rem}.badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;background:#e0e8e0;color:var(--text)}.badge.admin{background:#dbeafe;color:#1d4ed8}.status{display:inline-flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:500}.status.active{color:#16a34a}.status.inactive{color:#dc2626}.status::before{content:'';width:8px;height:8px;border-radius:50%;background:currentColor}.actions{display:flex;gap:8px}.btn-icon{width:36px;height:36px;border:none;background:#f0f4f0;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text);transition:all 0.2s}.btn-icon:hover{background:#e0e8e0;color:var(--primary)}.btn-icon.danger:hover{background:#fef2f2;color:#dc2626}
</style>

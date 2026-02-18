<script lang="ts">
  import { onMount } from 'svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';

  interface Message {
    id: string;
    name: string;
    email: string;
    phone: string;
    service_type: string;
    message: string;
    created_at: string;
  }

  let messages = $state<Message[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadMessages();
  });

  async function loadMessages() {
    loading = true;
    error = '';

    try {
      // This would need a protected admin endpoint to fetch all messages
      // For now, using a placeholder approach
      const response = await fetch('https://backend-nine-dun-99.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Admin Check',
          email: 'admin@jni.com',
          phone: '0000000000',
          message: 'Admin access check',
          service_type: 'system'
        })
      });

      // Since we can't fetch messages without proper auth, show placeholder
      messages = [];
      error = 'Contact messages endpoint needs authentication. This will be implemented in the next phase.';
    } catch (err) {
      error = 'Messages functionality requires admin authentication. Please set up the admin_users table in Supabase first.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Messages - Admin Dashboard</title>
</svelte:head>

<div class="messages-page">
  <div class="page-header">
    <h1>Contact Messages</h1>
    <div class="header-info">
      <span class="info-badge">ℹ️ Read-only access</span>
    </div>
  </div>

  {#if error}
    <div class="setup-info">
      <div class="info-icon">🔧</div>
      <h2>Setup Required</h2>
      <p>{error}</p>
      <div class="setup-steps">
        <h3>To enable messages:</h3>
        <ol>
          <li>Run the migration script in Supabase SQL editor:
            <code>backend/migrate_admin_users.sql</code>
          </li>
          <li>Seed the admin user:
            <code>node backend/seed-admin.js</code>
          </li>
          <li>Login with email: <code>admin@jni.com</code> and password: <code>Admin@123</code>
          </li>
        </ol>
      </div>
    </div>
  {:else if loading}
    <div class="loading-list">
      {#each Array(5) as _}
        <SkeletonCard height="100px" />
      {/each}
    </div>
  {:else if messages.length === 0}
    <div class="empty-state">
      <div class="empty-icon">✉️</div>
      <h2>No Messages Yet</h2>
      <p>Contact messages will appear here after setup</p>
    </div>
  {:else}
    <div class="messages-list">
      {#each messages as message}
        <div class="message-card">
          <div class="message-header">
            <h3>{message.name}</h3>
            <span class="date-badge">{new Date(message.created_at).toLocaleString()}</span>
          </div>
          <div class="message-details">
            <span class="detail-item">
              <span class="detail-icon">📧</span>
              {message.email}
            </span>
            <span class="detail-item">
              <span class="detail-icon">📞</span>
              {message.phone || 'Not provided'}
            </span>
            <span class="detail-item">
              <span class="detail-icon">🛠️</span>
              {message.service_type || 'General inquiry'}
            </span>
          </div>
          <p class="message-content">{message.message}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .messages-page {
    max-width: 1200px;
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

  .header-info {
    display: flex;
    gap: 12px;
  }

  .info-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .loading-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .setup-info {
    background: white;
    border-radius: var(--radius-lg);
    padding: 40px;
    box-shadow: var(--shadow-md);
    text-align: center;
  }

  .info-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .setup-info h2 {
    margin: 0 0 16px 0;
    color: var(--text-dark);
  }

  .setup-info p {
    margin: 0 0 30px 0;
    color: var(--text-light);
    line-height: 1.6;
  }

  .setup-steps {
    text-align: left;
    background: var(--bg-light);
    padding: 20px;
    border-radius: var(--radius-md);
  }

  .setup-steps h3 {
    margin: 0 0 12px 0;
    color: var(--text-dark);
  }

  .setup-steps ol {
    margin: 0;
    padding-left: 20px;
  }

  .setup-steps li {
    margin-bottom: 12px;
    color: var(--text);
    line-height: 1.6;
  }

  .setup-steps code {
    background: var(--text-dark);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: var(--font-size-sm);
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
    margin: 0;
    color: var(--text-light);
  }

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .message-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-md);
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .message-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: var(--font-size-lg);
  }

  .date-badge {
    color: var(--text-light);
    font-size: var(--font-size-sm);
  }

  .message-details {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-light);
    font-size: var(--font-size-sm);
  }

  .detail-icon {
    font-size: 1rem;
  }

  .message-content {
    margin: 0;
    color: var(--text);
    line-height: 1.6;
    padding: 16px;
    background: var(--bg-light);
    border-radius: var(--radius-md);
  }

  @media (max-width: 768px) {
    .message-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .message-details {
      flex-direction: column;
      gap: 8px;
    }
  }
</style>

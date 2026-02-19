<script lang="ts">
  import { onMount } from 'svelte';
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
      await fetch('https://backend-nine-dun-99.vercel.app/api/contact', {
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
    } catch (_err) {
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
    <div class="header-content">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div class="header-text">
        <h1>Messages</h1>
        <p>Contact form submissions</p>
      </div>
    </div>
    <div class="header-info">
      <span class="info-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Read-only
      </span>
    </div>
  </div>

  {#if error}
    <div class="setup-info">
      <div class="setup-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </div>
      <h2>Setup Required</h2>
      <p class="error-message">{error}</p>
      <div class="setup-steps">
        <h3>To enable messages:</h3>
        <ol>
          <li>
            <span class="step-number">1</span>
            <div class="step-content">
              <span>Run the migration script in Supabase SQL editor:</span>
              <code>backend/migrate_admin_users.sql</code>
            </div>
          </li>
          <li>
            <span class="step-number">2</span>
            <div class="step-content">
              <span>Seed the admin user:</span>
              <code>node backend/seed-admin.js</code>
            </div>
          </li>
          <li>
            <span class="step-number">3</span>
            <div class="step-content">
              <span>Login with:</span>
              <code>admin@jni.com</code> / <code>Admin@123</code>
            </div>
          </li>
        </ol>
      </div>
    </div>
  {:else if loading}
    <div class="loading-list">
      {#each Array(5) as _}
        <SkeletonCard height="120px" />
      {/each}
    </div>
  {:else if messages.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <h2>No Messages Yet</h2>
      <p>Contact messages will appear here</p>
    </div>
  {:else}
    <div class="messages-list">
      {#each messages as message}
        <div class="message-card">
          <div class="message-header">
            <div class="sender-info">
              <div class="sender-avatar">
                {message.name.charAt(0).toUpperCase()}
              </div>
              <div class="sender-details">
                <h3>{message.name}</h3>
                <span class="date-badge">{new Date(message.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <span class="service-badge">{message.service_type || 'General'}</span>
          </div>
          <div class="message-meta">
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{message.email}</span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{message.phone || 'Not provided'}</span>
            </div>
          </div>
          <div class="message-content">
            <p>{message.message}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .messages-page {
    max-width: 900px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1565c0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-text h1 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .header-text p {
    margin: 4px 0 0 0;
    color: var(--text-light);
    font-size: 0.9rem;
  }

  .info-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .loading-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .setup-info {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
  }

  .setup-icon {
    width: 88px;
    height: 88px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0f4f0 0%, #e0e8e0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }

  .setup-info h2 {
    margin: 0 0 12px 0;
    color: var(--text-dark);
    font-size: 1.25rem;
    font-weight: 700;
  }

  .error-message {
    margin: 0 0 28px 0;
    color: var(--text-light);
    line-height: 1.6;
  }

  .setup-steps {
    text-align: left;
    background: #f8faf8;
    padding: 24px;
    border-radius: 14px;
  }

  .setup-steps h3 {
    margin: 0 0 16px 0;
    color: var(--text-dark);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .setup-steps ol {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .setup-steps li {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    color: var(--text);
    line-height: 1.5;
  }

  .step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .step-content span {
    color: var(--text-light);
    font-size: 0.9rem;
  }

  .setup-steps code {
    background: #1a2920;
    color: #a7f3d0;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 0.8rem;
    display: inline-block;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .empty-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0f4f0 0%, #e0e8e0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
  }

  .empty-state h2 {
    margin: 0 0 10px 0;
    color: var(--text-dark);
    font-size: 1.25rem;
    font-weight: 700;
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
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .message-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .sender-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sender-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary) 0%, #2d6a37 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .sender-details h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1rem;
    font-weight: 600;
  }

  .date-badge {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-top: 2px;
    display: block;
  }

  .service-badge {
    background: rgba(21, 101, 192, 0.1);
    color: #1565c0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .message-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-light);
    font-size: 0.85rem;
  }

  .meta-item svg {
    flex-shrink: 0;
    color: var(--text-light);
  }

  .message-content {
    padding: 16px;
    background: #f8faf8;
    border-radius: 12px;
    border-left: 3px solid var(--primary);
  }

  .message-content p {
    margin: 0;
    color: var(--text);
    line-height: 1.7;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .message-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .message-meta {
      flex-direction: column;
      gap: 8px;
    }

    .setup-info {
      padding: 28px 20px;
    }
  }
</style>

<script lang="ts">
  import { user } from '$lib/stores/auth';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  let { data } = $props();
</script>

{#if data.error}
  <ErrorMessage
    title="Dashboard Error"
    message={data.error}
    onRetry={() => window.location.reload()}
  />
{:else}
  <div class="dashboard">
    <div class="welcome-section">
      <h2>Welcome back, {$user?.name}! 👋</h2>
      <p>Here's what's happening with your website today.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon services">🛠️</div>
        <div class="stat-info">
          <h3>Services</h3>
          <p class="stat-number">{data.stats.services}</p>
        </div>
        <a href="/admin/services" class="stat-action">Manage →</a>
      </div>

      <div class="stat-card">
        <div class="stat-icon articles">📝</div>
        <div class="stat-info">
          <h3>Articles</h3>
          <p class="stat-number">{data.stats.articles}</p>
        </div>
        <a href="/admin/articles" class="stat-action">Manage →</a>
      </div>

      <div class="stat-card">
        <div class="stat-icon testimonials">💬</div>
        <div class="stat-info">
          <h3>Testimonials</h3>
          <p class="stat-number">{data.stats.testimonials}</p>
        </div>
        <a href="/admin/testimonials" class="stat-action">Manage →</a>
      </div>

      <div class="stat-card">
        <div class="stat-icon clients">🏢</div>
        <div class="stat-info">
          <h3>Clients</h3>
          <p class="stat-number">{data.stats.clients}</p>
        </div>
        <a href="/admin/clients" class="stat-action">Manage →</a>
      </div>
    </div>

    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <a href="/admin/services/new" class="action-card">
          <span class="action-icon">➕</span>
          <span class="action-text">Add Service</span>
        </a>
        <a href="/admin/articles/new" class="action-card">
          <span class="action-icon">📝</span>
          <span class="action-text">Write Article</span>
        </a>
        <a href="/admin/messages" class="action-card">
          <span class="action-icon">✉️</span>
          <span class="action-text">View Messages</span>
        </a>
        <a href="/admin/gallery" class="action-card">
          <span class="action-icon">🖼️</span>
          <span class="action-text">Manage Gallery</span>
        </a>
      </div>
    </div>

    <div class="recent-activity">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div class="activity-item">
          <span class="activity-icon">🚀</span>
          <div class="activity-content">
            <p>Admin dashboard initialized</p>
            <span class="activity-time">Just now</span>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-icon">🔒</span>
          <div class="activity-content">
            <p>Authentication system set up</p>
            <span class="activity-time">Today</span>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-icon">🛡️</span>
          <div class="activity-content">
            <p>Security improvements deployed</p>
            <span class="activity-time">Today</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .welcome-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 30px;
    border-radius: var(--radius-lg);
    margin-bottom: 30px;
  }

  .welcome-section h2 {
    margin: 0 0 8px 0;
    font-size: var(--font-size-2xl);
  }

  .welcome-section p {
    margin: 0;
    opacity: 0.9;
    font-size: var(--font-size-lg);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-md);
    position: relative;
    transition: var(--transition);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .stat-icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }

  .stat-info h3 {
    margin: 0 0 8px 0;
    color: var(--text-light);
    font-size: var(--font-size-base);
    font-weight: 500;
  }

  .stat-number {
    margin: 0;
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-dark);
  }

  .stat-action {
    display: block;
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-size-sm);
    margin-top: 16px;
  }

  .stat-action:hover {
    text-decoration: underline;
  }

  .quick-actions {
    background: white;
    border-radius: var(--radius-lg);
    padding: 30px;
    box-shadow: var(--shadow-md);
    margin-bottom: 30px;
  }

  .quick-actions h3 {
    margin: 0 0 24px 0;
    color: var(--text-dark);
    font-size: var(--font-size-xl);
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text);
    transition: var(--transition);
  }

  .action-card:hover {
    border-color: var(--primary);
    background: var(--bg-light);
  }

  .action-icon {
    font-size: 1.5rem;
  }

  .action-text {
    font-weight: 600;
  }

  .recent-activity {
    background: white;
    border-radius: var(--radius-lg);
    padding: 30px;
    box-shadow: var(--shadow-md);
  }

  .recent-activity h3 {
    margin: 0 0 24px 0;
    color: var(--text-dark);
    font-size: var(--font-size-xl);
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--bg-light);
  }

  .activity-icon {
    font-size: 1.5rem;
  }

  .activity-content {
    flex: 1;
  }

  .activity-content p {
    margin: 0 0 4px 0;
    color: var(--text);
    font-weight: 500;
  }

  .activity-time {
    font-size: var(--font-size-xs);
    color: var(--text-light);
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

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
      <div class="welcome-content">
        <div class="welcome-badge">Dashboard</div>
        <h2>Welcome back, {$user?.name}!</h2>
        <p>Here's what's happening with your website today.</p>
      </div>
      <div class="welcome-illustration">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="rgba(255,255,255,0.1)"/>
          <circle cx="60" cy="60" r="35" fill="rgba(255,255,255,0.15)"/>
          <path d="M45 60L55 70L75 50" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon services">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="stat-trend up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            <span>Active</span>
          </div>
        </div>
        <div class="stat-body">
          <span class="stat-number">{data.stats.services}</span>
          <span class="stat-label">Total Services</span>
        </div>
        <a href="/admin/services" class="stat-link">
          <span>Manage services</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon articles">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="stat-trend up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            <span>Published</span>
          </div>
        </div>
        <div class="stat-body">
          <span class="stat-number">{data.stats.articles}</span>
          <span class="stat-label">Total Articles</span>
        </div>
        <a href="/admin/articles" class="stat-link">
          <span>Manage articles</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon testimonials">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="stat-trend up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            <span>Reviews</span>
          </div>
        </div>
        <div class="stat-body">
          <span class="stat-number">{data.stats.testimonials}</span>
          <span class="stat-label">Testimonials</span>
        </div>
        <a href="/admin/testimonials" class="stat-link">
          <span>Manage testimonials</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon clients">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-trend up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            <span>Partners</span>
          </div>
        </div>
        <div class="stat-body">
          <span class="stat-number">{data.stats.clients}</span>
          <span class="stat-label">Total Clients</span>
        </div>
        <a href="/admin/clients" class="stat-link">
          <span>Manage clients</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="quick-actions">
        <div class="section-header">
          <h3>Quick Actions</h3>
          <span class="section-badge">Shortcuts</span>
        </div>
        <div class="actions-grid">
          <a href="/admin/services/new" class="action-card">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div class="action-content">
              <span class="action-title">Add Service</span>
              <span class="action-desc">Create a new service offering</span>
            </div>
          </a>
          <a href="/admin/articles/new" class="action-card">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div class="action-content">
              <span class="action-title">Write Article</span>
              <span class="action-desc">Publish a new blog post</span>
            </div>
          </a>
          <a href="/admin/messages" class="action-card">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div class="action-content">
              <span class="action-title">View Messages</span>
              <span class="action-desc">Check contact inquiries</span>
            </div>
          </a>
          <a href="/admin/gallery" class="action-card">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="action-content">
              <span class="action-title">Manage Gallery</span>
              <span class="action-desc">Upload project photos</span>
            </div>
          </a>
        </div>
      </div>

      <div class="recent-activity">
        <div class="section-header">
          <h3>Recent Activity</h3>
          <span class="section-badge">Today</span>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="activity-content">
              <p>Admin dashboard initialized</p>
              <span class="activity-time">Just now</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div class="activity-content">
              <p>Authentication system secured</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="activity-content">
              <p>Security improvements deployed</p>
              <span class="activity-time">5 hours ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon neutral">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="activity-content">
              <p>System backup completed</p>
              <span class="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Welcome Section */
  .welcome-section {
    background: linear-gradient(135deg, var(--primary) 0%, #1a4d2e 50%, #0f2d1a 100%);
    color: white;
    padding: 40px;
    border-radius: 20px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px -10px rgba(56, 124, 68, 0.3);
  }

  .welcome-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .welcome-content {
    position: relative;
    z-index: 1;
  }

  .welcome-badge {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);
  }

  .welcome-section h2 {
    margin: 0 0 8px 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .welcome-section p {
    margin: 0;
    opacity: 0.85;
    font-size: 1rem;
  }

  .welcome-illustration {
    position: relative;
    z-index: 1;
    opacity: 0.9;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.12);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-icon.services {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
  }

  .stat-icon.articles {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1565c0;
  }

  .stat-icon.testimonials {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    color: #ef6c00;
  }

  .stat-icon.clients {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    color: #7b1fa2;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .stat-trend.up {
    background: rgba(56, 124, 68, 0.1);
    color: var(--primary);
  }

  .stat-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-number {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--text-light);
    font-weight: 500;
  }

  .stat-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    color: var(--text);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .stat-link:hover {
    color: var(--primary);
  }

  .stat-link svg {
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.2s ease;
  }

  .stat-link:hover svg {
    opacity: 1;
    transform: translateX(0);
  }

  /* Dashboard Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dark);
    letter-spacing: -0.01em;
  }

  .section-badge {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    background: rgba(56, 124, 68, 0.1);
    color: var(--primary);
    border-radius: 20px;
  }

  /* Quick Actions */
  .quick-actions {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    border-radius: 14px;
    text-decoration: none;
    color: var(--text);
    background: #f8faf8;
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .action-card:hover {
    background: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(56, 124, 68, 0.15);
    transform: translateY(-2px);
  }

  .action-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary) 0%, #2d6a37 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .action-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .action-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-dark);
  }

  .action-desc {
    font-size: 0.75rem;
    color: var(--text-light);
  }

  /* Recent Activity */
  .recent-activity {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    border-radius: 12px;
    background: #f8faf8;
    transition: background 0.2s ease;
  }

  .activity-item:hover {
    background: #f0f4f0;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .activity-icon.success {
    background: rgba(56, 124, 68, 0.12);
    color: var(--primary);
  }

  .activity-icon.info {
    background: rgba(21, 101, 192, 0.12);
    color: #1565c0;
  }

  .activity-icon.warning {
    background: rgba(245, 124, 0, 0.12);
    color: #f57c00;
  }

  .activity-icon.neutral {
    background: rgba(97, 97, 97, 0.12);
    color: #616161;
  }

  .activity-content {
    flex: 1;
    min-width: 0;
  }

  .activity-content p {
    margin: 0;
    color: var(--text-dark);
    font-weight: 500;
    font-size: 0.9rem;
  }

  .activity-time {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-top: 4px;
    display: block;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .welcome-section {
      padding: 28px;
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    .welcome-illustration {
      display: none;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .welcome-section {
      padding: 24px;
      border-radius: 16px;
    }

    .welcome-section h2 {
      font-size: 1.4rem;
    }

    .quick-actions,
    .recent-activity {
      padding: 20px;
      border-radius: 16px;
    }
  }
</style>

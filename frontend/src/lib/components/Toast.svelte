<script lang="ts">
  import { toasts } from '$lib/stores/toasts';

  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each $toasts as toast (toast.id)}
    <div class="toast {toast.type}" role="alert">
      <span class="toast-icon">{@html icons[toast.type]}</span>
      <span class="toast-message">{toast.message}</span>
      <button
        type="button"
        class="toast-close"
        onclick={() => toasts.remove(toast.id)}
        aria-label="Close notification"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.05);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .toast.success {
    border-left: 4px solid #22c55e;
  }

  .toast.success .toast-icon {
    color: #22c55e;
  }

  .toast.error {
    border-left: 4px solid #ef4444;
  }

  .toast.error .toast-icon {
    color: #ef4444;
  }

  .toast.warning {
    border-left: 4px solid #f59e0b;
  }

  .toast.warning .toast-icon {
    color: #f59e0b;
  }

  .toast.info {
    border-left: 4px solid #3b82f6;
  }

  .toast.info .toast-icon {
    color: #3b82f6;
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-message {
    flex: 1;
    font-size: 0.9rem;
    color: var(--text-dark);
    line-height: 1.4;
  }

  .toast-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--text-light);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .toast-close:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text);
  }

  @media (max-width: 480px) {
    .toast-container {
      left: 16px;
      right: 16px;
      bottom: 16px;
      max-width: none;
    }

    .toast {
      padding: 12px 14px;
    }
  }
</style>

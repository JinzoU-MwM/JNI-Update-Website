<script lang="ts">
  interface Props {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onconfirm: () => void;
    oncancel: () => void;
  }

  let {
    open,
    title = 'Konfirmasi',
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger',
    onconfirm,
    oncancel
  }: Props = $props();

  function handleConfirm() {
    onconfirm();
  }

  function handleCancel() {
    oncancel();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleCancel();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="dialog-overlay" onclick={handleCancel} role="presentation">
    <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-message">
      <div class="dialog-icon {variant}">
        {#if variant === 'danger'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        {:else if variant === 'warning'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        {/if}
      </div>

      <h3 id="dialog-title" class="dialog-title">{title}</h3>
      <p id="dialog-message" class="dialog-message">{message}</p>

      <div class="dialog-actions">
        <button type="button" class="btn btn-cancel" onclick={handleCancel}>
          {cancelText}
        </button>
        <button type="button" class="btn btn-confirm {variant}" onclick={handleConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .dialog {
    background: white;
    border-radius: 20px;
    padding: 32px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dialog-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .dialog-icon.danger {
    background: #fef2f2;
    color: #ef4444;
  }

  .dialog-icon.warning {
    background: #fffbeb;
    color: #f59e0b;
  }

  .dialog-icon.info {
    background: #eff6ff;
    color: #3b82f6;
  }

  .dialog-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 12px;
  }

  .dialog-message {
    color: var(--text-light);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 28px;
  }

  .dialog-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel {
    background: #f1f5f9;
    color: var(--text);
  }

  .btn-cancel:hover {
    background: #e2e8f0;
  }

  .btn-confirm {
    color: white;
  }

  .btn-confirm.danger {
    background: #ef4444;
  }

  .btn-confirm.danger:hover {
    background: #dc2626;
  }

  .btn-confirm.warning {
    background: #f59e0b;
  }

  .btn-confirm.warning:hover {
    background: #d97706;
  }

  .btn-confirm.info {
    background: #3b82f6;
  }

  .btn-confirm.info:hover {
    background: #2563eb;
  }

  @media (max-width: 480px) {
    .dialog {
      padding: 24px;
    }

    .dialog-actions {
      flex-direction: column-reverse;
    }
  }
</style>

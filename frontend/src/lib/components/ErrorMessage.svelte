<script lang="ts">
  interface Props {
    title: string;
    message?: string;
    onRetry?: () => void;
  }

  let { title, message, onRetry }: Props = $props();
</script>

<div class="error-message">
  <div class="error-icon">⚠️</div>
  <h3 class="error-title">{title}</h3>
  {#if message}
    <p class="error-message">{message}</p>
  {/if}
  {#if onRetry}
    <button class="error-retry-btn" onclick={onRetry}>Coba Lagi</button>
  {/if}
</div>

<style>
  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 20px;
    background: var(--bg-light);
    border-radius: var(--radius-lg);
    border: 2px solid var(--danger);
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .error-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--danger);
    margin: 0 0 8px 0;
  }

  .error-message p {
    color: var(--text-light);
    margin: 0 0 20px 0;
    max-width: 400px;
  }

  .error-retry-btn {
    padding: 12px 24px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }

  .error-retry-btn:hover {
    background: var(--primary-dark);
  }
</style>

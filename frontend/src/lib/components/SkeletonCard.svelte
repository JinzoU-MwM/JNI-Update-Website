<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
  }

  let { width = '100%', height = '200px' }: Props = $props();
</script>

<div class="skeleton-card" style="width: {width}; height: {height};">
  <div class="skeleton-shimmer"></div>
</div>

<style>
  .skeleton-card {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
    position: relative;
  }

  .skeleton-shimmer {
    position: absolute;
    inset: 0;
    animation: shimmer 1.5s infinite;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>

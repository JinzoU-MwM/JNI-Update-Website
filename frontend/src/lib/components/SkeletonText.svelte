<script lang="ts">
  interface Props {
    lines?: number;
    height?: string;
    width?: string;
  }

  let { lines = 3, height = '16px', width = '100%' }: Props = $props();
</script>

<div class="skeleton-text">
  {#each Array(lines) as _, i}
    <div class="skeleton-line" style="height: {height}; width: {width};"></div>
  {/each}
</div>

<style>
  .skeleton-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .skeleton-line {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>

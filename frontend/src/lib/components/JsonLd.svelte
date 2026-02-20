<script lang="ts">
  interface Props {
    data: Record<string, unknown>;
  }

  let { data }: Props = $props();
</script>

{@html `<script type="application/ld+json">${JSON.stringify(data)}</script>`}

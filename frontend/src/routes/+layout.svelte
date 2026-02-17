<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import WhatsAppFloat from '$lib/components/WhatsAppFloat.svelte';
  import '$lib/styles/global.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/png" href="/images/logo-jabat.png" />
</svelte:head>

<Navbar />
<main>
  {@render children()}
</main>
<Footer />
<WhatsAppFloat />

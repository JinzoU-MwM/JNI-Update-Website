<script lang="ts">
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import WhatsAppFloat from '$lib/components/WhatsAppFloat.svelte';
  import '$lib/styles/global.css';

  let { children } = $props();

  let isAdmin = $derived($page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/png" href="/images/logo-jabat.png" />
</svelte:head>

{#if !isAdmin}
  <Navbar />
{/if}
<main id="main-content">
  {@render children()}
</main>
{#if !isAdmin}
  <Footer />
  <WhatsAppFloat />
{/if}


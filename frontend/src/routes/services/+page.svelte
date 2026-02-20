<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Layanan Kami - Jamnasindo</title>
  <meta name="description" content="Layanan Konsultan JNI - Izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan." />
  <link rel="canonical" href="https://jamnasindo.id/services" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://jamnasindo.id/services" />
  <meta property="og:title" content="Layanan Kami - Jamnasindo" />
  <meta property="og:description" content="Layanan Konsultan JNI - Izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan." />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="page-header">
  <div class="container">
    <h1>Layanan Kami</h1>
    <div class="breadcrumb">
      <a href="/">Beranda</a>
      <span class="breadcrumb-separator">/</span>
      <span>Layanan</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Layanan Lengkap</span>
      <h2>Solusi Profesional untuk <span>Kebutuhan Bisnis</span></h2>
    </div>

    <div class="services-grid">
      {#each data.services as service}
        <a href="/services/{service.slug}" class="service-card">
          <div class="service-icon">
            {#if service.icon_svg}
              {@html service.icon_svg}
            {:else if service.image_url}
              <img src={service.image_url} alt={service.title} loading="lazy" style="width:40px;height:40px;object-fit:contain;" />
            {/if}
          </div>
          <h3>{service.title}</h3>
          <p>{service.short_description}</p>
          <span class="btn-card">Selengkapnya</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="cta">
  <div class="container">
    <h2>Butuh Layanan Lain?</h2>
    <p>Hubungi kami untuk konsultasi kebutuhan perizinan dan legalitas bisnis Anda.</p>
    <a href="/contact" class="btn btn-white">Hubungi Kami</a>
  </div>
</section>

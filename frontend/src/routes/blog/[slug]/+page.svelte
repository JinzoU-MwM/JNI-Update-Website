<script lang="ts">
  import JsonLd from '$lib/components/JsonLd.svelte';

  let { data } = $props();

  const formattedDate = $derived(
    data.article.created_at
      ? new Date(data.article.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : ''
  );

  const isoDate = $derived(
    data.article.created_at
      ? new Date(data.article.created_at).toISOString()
      : new Date().toISOString()
  );

  const canonicalUrl = `https://jamnasindo.id/blog/${data.article.slug}`;

  // Article structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.article.title,
    "description": data.article.meta_description || data.article.excerpt,
    "image": data.article.image_url || "https://jamnasindo.id/images/hero-section.jpeg",
    "datePublished": isoDate,
    "dateModified": data.article.updated_at || isoDate,
    "author": {
      "@type": "Person",
      "name": data.article.author || "JNI Consultant"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JNI Consultant - Jamnasindo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jamnasindo.id/images/logo-jamnasindoo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://jamnasindo.id/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://jamnasindo.id/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.article.title
      }
    ]
  };
</script>

<svelte:head>
  <title>{data.article.meta_title || data.article.title} - Jamnasindo</title>
  <meta name="description" content={data.article.meta_description || data.article.excerpt} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={data.article.meta_title || data.article.title} />
  <meta property="og:description" content={data.article.meta_description || data.article.excerpt} />
  {#if data.article.image_url}
    <meta property="og:image" content={data.article.image_url} />
  {/if}
  <meta property="article:published_time" content={isoDate} />
  <meta property="article:author" content={data.article.author || "JNI Consultant"} />
  <meta property="article:section" content={data.article.category} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.article.meta_title || data.article.title} />
  <meta name="twitter:description" content={data.article.meta_description || data.article.excerpt} />
</svelte:head>

<JsonLd data={articleSchema} />
<JsonLd data={breadcrumbSchema} />

<section class="page-header">
  <div class="container">
    <span class="article-category-badge">{data.article.category}</span>
    <h1>{data.article.title}</h1>
    <div class="article-header-meta">
      <span>{data.article.author}</span>
      <span>•</span>
      <span>{formattedDate}</span>
      <span>•</span>
      <span>{data.article.read_time}</span>
    </div>
  </div>
</section>

<section class="section article-section">
  <div class="container">
    <div class="article-content-wrapper">
      <article class="article-content">
        {#if data.article.image_url}
          <div class="article-hero-image">
            <img src={data.article.image_url} alt={data.article.title} loading="lazy" />
          </div>
        {/if}
        <div class="prose">{@html data.article.content}</div>
      </article>

      <aside class="article-sidebar">
        <div class="sidebar-card">
          <h4>Butuh Konsultasi?</h4>
          <p>Hubungi tim kami untuk konsultasi gratis tentang perizinan dan legalitas bisnis Anda.</p>
          <a href="/contact" class="btn btn-primary" style="width:100%;justify-content:center;">Hubungi Kami</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<style>
  .article-category-badge {
    display: inline-block;
    padding: 4px 14px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .article-header-meta {
    display: flex;
    gap: 8px;
    justify-content: center;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 12px;
  }

  .article-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 48px;
  }

  .article-hero-image {
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .article-hero-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .prose {
    color: #475569;
    line-height: 1.9;
    font-size: 1.05rem;
  }

  .prose :global(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 32px 0 16px;
  }

  .prose :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 24px 0 12px;
  }

  .prose :global(ul), .prose :global(ol) {
    padding-left: 24px;
    margin: 16px 0;
    list-style: disc;
  }

  .prose :global(li) {
    margin-bottom: 8px;
  }

  .sidebar-card {
    background: white;
    padding: 28px;
    border-radius: 16px;
    border: 1px solid var(--border);
    position: sticky;
    top: 100px;
  }

  .sidebar-card h4 {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 12px;
  }

  .sidebar-card p {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .article-content-wrapper {
      grid-template-columns: 1fr;
    }
  }
</style>

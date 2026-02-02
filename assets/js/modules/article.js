/* =====================================================
   Article API Module - Fetch from PHP/MySQL Backend
   =====================================================
   
   This module replaces the static JavaScript data store
   with dynamic fetching from the PHP API.
   
   API Endpoints:
   - GET /api/get_articles.php          → All articles (blog list)
   - GET /api/get_articles.php?slug=xxx → Single article (detail)
*/

const ArticleAPI = {
  // API base URL - adjust if needed
  apiUrl: '/api/get_articles.php',

  /**
   * Fetch all articles for blog listing page
   * @returns {Promise<Array>} Array of article objects
   */
  async fetchAllArticles() {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        console.error('API Error:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return [];
    }
  },

  /**
   * Fetch single article by slug for detail page
   * @param {string} slug - Article slug/ID
   * @returns {Promise<Object|null>} Article object or null
   */
  async fetchArticleBySlug(slug) {
    try {
      const response = await fetch(`${this.apiUrl}?slug=${encodeURIComponent(slug)}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        console.error('API Error:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return null;
    }
  },

  /**
   * Get article slug from URL parameter
   * @returns {string|null} Slug from ?id= or ?slug= parameter
   */
  getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('slug');
  }
};


/* =====================================================
   Blog Module - Render Article Cards (blog.html)
   ===================================================== */

const BlogModule = {
  async init() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;  // Not on blog page

    // Show loading state and Clear Container (Fix for Ghost Articles)
    blogGrid.innerHTML = '';
    blogGrid.innerHTML = '<p class="loading-text">Memuat artikel...</p>';

    // Fetch articles from API
    const articles = await ArticleAPI.fetchAllArticles();

    if (articles.length > 0) {
      this.renderArticleCards(blogGrid, articles);
    } else {
      blogGrid.innerHTML = '<div class="col-12 text-center py-5"><h3>Belum ada artikel saat ini.</h3></div>';
    }
  },

  renderArticleCards(container, articles) {
    const html = articles.map(article => `
            <article class="blog-card" data-article-id="${article.slug}">
                <a href="article.html?id=${article.slug}" class="blog-card-link">
                    <div class="blog-image">
                        <img src="${article.image_url}" alt="${article.title}" loading="lazy">
                        <span class="blog-category">${article.category}</span>
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span>📅 ${article.formatted_date}</span>
                            <span>👤 ${article.author}</span>
                        </div>
                        <h3>${article.title}</h3>
                        <p>${article.excerpt || ''}</p>
                        <span class="read-more">Baca Selengkapnya →</span>
                    </div>
                </a>
            </article>
        `).join('');

    container.innerHTML = html;
  }
};


/* =====================================================
   Article Detail Module - Render Single Article (article.html)
   ===================================================== */

const ArticleDetailModule = {
  async init() {
    // Check if we're on article detail page
    const articleBody = document.getElementById('article-body');
    if (!articleBody) return;

    const slug = ArticleAPI.getSlugFromUrl();

    if (!slug) {
      this.showNotFound();
      return;
    }

    // Fetch article from API
    const article = await ArticleAPI.fetchArticleBySlug(slug);

    if (article) {
      this.renderArticle(article);
    } else {
      this.showNotFound();
    }
  },

  renderArticle(article) {
    const currentUrl = window.location.href;

    // Create excerpt for meta description
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.content;
    const excerpt = article.excerpt || tempDiv.textContent.substring(0, 160).trim() + '...';

    // ===== UPDATE PAGE TITLE =====
    document.getElementById('article-page-title').textContent = `${article.title} - JNI Consultant`;

    // ===== UPDATE SEO META TAGS =====
    this.updateMeta('meta-description', excerpt);
    this.updateMeta('meta-keywords', `${article.category}, perizinan, bisnis, JNI Consultant`);

    // Canonical URL
    const canonicalUrl = document.getElementById('canonical-url');
    if (canonicalUrl) canonicalUrl.href = currentUrl;

    // ===== UPDATE OPEN GRAPH TAGS =====
    this.updateMeta('og-title', article.title);
    this.updateMeta('og-description', excerpt);
    this.updateMeta('og-image', article.image_url);
    this.updateMeta('og-url', currentUrl);
    this.updateMeta('og-section', article.category);
    this.updateMeta('og-published', article.iso_date);

    // ===== UPDATE TWITTER CARD TAGS =====
    this.updateMeta('twitter-title', article.title);
    this.updateMeta('twitter-description', excerpt);
    this.updateMeta('twitter-image', article.image_url);

    // ===== UPDATE STRUCTURED DATA =====
    this.updateArticleSchema(article, currentUrl, excerpt);
    this.updateBreadcrumbSchema(article.title, currentUrl);

    // ===== UPDATE VISIBLE CONTENT =====
    document.getElementById('article-category').textContent = article.category;
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-date').textContent = `📅 ${article.formatted_date}`;
    document.getElementById('article-author').textContent = `👤 ${article.author}`;
    document.getElementById('article-read-time').textContent = `⏱️ ${article.read_time}`;

    // Update article content
    document.getElementById('article-image').src = article.image_url;
    document.getElementById('article-image').alt = article.title;
    document.getElementById('article-body').innerHTML = article.content;

    // Render related articles (from API response)
    if (article.relatedArticles) {
      this.renderRelatedArticles(article.relatedArticles);
    }

    // Setup share buttons
    this.setupShareButtons(article.title);
  },

  updateMeta(id, content) {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === 'META') {
        element.setAttribute('content', content);
      } else {
        element.textContent = content;
      }
    }
  },

  updateArticleSchema(article, url, excerpt) {
    const schemaElement = document.getElementById('article-schema');
    if (schemaElement) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": excerpt,
        "image": article.image_url,
        "author": {
          "@type": "Organization",
          "name": "JNI Consultant",
          "url": "https://jniconsultant.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "JNI Consultant",
          "logo": {
            "@type": "ImageObject",
            "url": "https://jniconsultant.com/assets/images/logo-jabat.png"
          }
        },
        "datePublished": article.iso_date,
        "dateModified": article.iso_date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": article.category
      };
      schemaElement.textContent = JSON.stringify(schema, null, 2);
    }
  },

  updateBreadcrumbSchema(title, url) {
    const schemaElement = document.getElementById('breadcrumb-schema');
    if (schemaElement) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://jniconsultant.com/" },
          { "@type": "ListItem", "position": 2, "name": "Artikel", "item": "https://jniconsultant.com/blog.html" },
          { "@type": "ListItem", "position": 3, "name": title, "item": url }
        ]
      };
      schemaElement.textContent = JSON.stringify(schema, null, 2);
    }
  },

  renderRelatedArticles(relatedArticles) {
    const container = document.getElementById('related-articles');
    if (!container || !relatedArticles.length) return;

    const html = relatedArticles.map(article => `
            <a href="article.html?id=${article.slug}" class="related-article-item">
                <img src="${article.image_url.replace('w=800', 'w=100').replace('h=400', 'h=60')}" alt="${article.title}">
                <div>
                    <span class="related-category">${article.category}</span>
                    <h5>${article.title}</h5>
                </div>
            </a>
        `).join('');

    container.innerHTML = html;
  },

  setupShareButtons(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    const whatsappBtn = document.getElementById('share-whatsapp');
    const linkedinBtn = document.getElementById('share-linkedin');

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/?text=${text}%20${url}`;
      whatsappBtn.target = '_blank';
    }

    if (linkedinBtn) {
      linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      linkedinBtn.target = '_blank';
    }
  },

  showNotFound() {
    document.getElementById('article-title').textContent = 'Artikel Tidak Ditemukan';
    document.getElementById('article-body').innerHTML = `
            <p>Maaf, artikel yang Anda cari tidak ditemukan.</p>
            <a href="blog.html" class="btn btn-primary">Kembali ke Daftar Artikel</a>
        `;
  }
};


/* =====================================================
   Auto-initialize when DOM is ready
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize blog grid (if on blog.html)
  BlogModule.init();

  // Initialize article detail (if on article.html)
  ArticleDetailModule.init();
});

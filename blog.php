<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Artikel dan berita terbaru seputar perizinan usaha, bisnis, dan regulasi di Indonesia dari Jamnasindo. Tips, panduan, dan informasi terkini.">
    <meta name="keywords"
        content="artikel perizinan, berita bisnis, izin PPIU, izin kontraktor, IATA, bank garansi, konsultan bisnis, tips usaha">
    <meta name="author" content="Jamnasindo">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://jniconsultant.com/blog.html">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Jamnasindo">
    <meta property="og:locale" content="id_ID">
    <meta property="og:title" content="Artikel & Berita Bisnis - Jamnasindo">
    <meta property="og:description"
        content="Artikel dan berita terbaru seputar perizinan usaha, bisnis, dan regulasi di Indonesia.">
    <meta property="og:image" content="https://jniconsultant.com/assets/images/og-blog.jpg">
    <meta property="og:url" content="https://jniconsultant.com/blog.html">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Artikel & Berita Bisnis - Jamnasindo">
    <meta name="twitter:description"
        content="Artikel dan berita terbaru seputar perizinan usaha, bisnis, dan regulasi di Indonesia.">
    <meta name="twitter:image" content="https://jniconsultant.com/assets/images/og-blog.jpg">

    <!-- Favicon & Fonts -->
    <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">

    <title>Artikel & Berita - Jamnasindo</title>

    <!-- Blog Page Specific Styles -->
    <style>
        /* =====================================================
           BLOG PAGE GRID LAYOUT
           ===================================================== */
        .blog-page-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 40px 20px;
            display: grid;
            gap: 30px;
            grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 991px) {
            .blog-page-container {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 576px) {
            .blog-page-container {
                grid-template-columns: 1fr;
            }
        }

        /* Card Styles */
        .blog-page-container .blog-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-page-container .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        /* Image Container - Fixed Height */
        .blog-page-container .blog-card-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }

        .blog-page-container .blog-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .blog-page-container .blog-card:hover .blog-card-image img {
            transform: scale(1.05);
        }

        .blog-page-container .blog-card-image .category-badge {
            position: absolute;
            top: 16px;
            left: 16px;
            background: linear-gradient(135deg, #387C44, #4CAF50);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Card Body */
        .blog-page-container .blog-card-body {
            padding: 24px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .blog-page-container .blog-card-meta {
            display: flex;
            gap: 16px;
            margin-bottom: 12px;
            font-size: 0.85rem;
            color: #64748b;
        }

        .blog-page-container .blog-card-meta span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .blog-page-container .blog-card-body h3 {
            font-size: 1.15rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .blog-page-container .blog-card-body p {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 20px;
            flex-grow: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .blog-page-container .btn-read-more {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #387C44;
            font-weight: 600;
            font-size: 0.9rem;
            text-decoration: none;
            margin-top: auto;
            transition: gap 0.3s ease;
        }

        .blog-page-container .btn-read-more:hover {
            gap: 12px;
            color: #2d6339;
        }

        /* Empty State */
        .blog-empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 80px 20px;
            background: #f8fafc;
            border-radius: 16px;
        }

        .blog-empty-state h3 {
            color: #475569;
            margin-bottom: 8px;
        }

        .blog-empty-state p {
            color: #94a3b8;
        }
    </style>

    <!-- Blog Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog Jamnasindo",
        "description": "Artikel dan berita terbaru seputar perizinan usaha, bisnis, dan regulasi di Indonesia",
        "url": "https://jniconsultant.com/blog.html",
        "publisher": {
            "@type": "Organization",
            "name": "Jamnasindo",
            "logo": {
                "@type": "ImageObject",
                "url": "https://jniconsultant.com/assets/images/logo-jamnasindoo.png"
            }
        }
    }
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Beranda",
                "item": "https://jniconsultant.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Artikel",
                "item": "https://jniconsultant.com/blog.html"
            }
        ]
    }
    </script>
</head>

<body>
    <!-- ===== NAVBAR - EASTUTE STYLE (Inner Page) ===== -->
    <nav class="navbar nav-inner" id="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a href="/">
                <img src="assets/images/logo-jamnasindoo.png?v=999" alt="Jamnasindo" class="logo-img">
                </a>
            </div>
            <div class="navbar-center">
                <ul class="navbar-menu">
                    <li><a href="/">Beranda</a></li>
                    <li><a href="services">Layanan</a></li>
                    <li><a href="about">Tentang Kami</a></li>
                    <li><a href="blog" class="active">Artikel</a></li>
                    <li><a href="gallery">Galeri</a></li>
                    <li><a href="contact">Kontak</a></li>
                </ul>
            </div>
            <div class="navbar-actions">
                <button class="lang-selector">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                        </path>
                    </svg>
                    <span>ID</span>
                    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <a href="contact" class="navbar-cta">Konsultasi</a>
            </div>
            <button class="navbar-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
        </div>
    </nav>

    <section class="page-header">
        <div class="container">
            <h1>Artikel & Berita</h1>
            <div class="breadcrumb">
                <a href="/">Beranda</a>
                <span class="breadcrumb-separator">/</span>
                <span>Artikel</span>
            </div>
        </div>
    </section>

    <section class="section blog">
        <div class="container">
            <div class="section-header">
                <span class="section-badge">Blog</span>
                <h2>Informasi Terbaru <span>Seputar Bisnis</span></h2>
            </div>
            
            <?php
            // Fetch Articles Server-Side
            // Reusing logic from index.php / api/get_articles.php but inline for simplicity
            require_once 'api/config.php';
            require_once 'api/tracker.php';
            try {
                $pdo = getDbConnection();
                $stmt = $pdo->query("SELECT * FROM articles WHERE is_published = 1 ORDER BY created_at DESC");
                $articles = $stmt->fetchAll();
            } catch (Exception $e) {
                // Determine error state
                $articles = [];
            }
            ?>

            <div class="blog-page-container">
                <?php if (count($articles) > 0): ?>
                    <?php foreach ($articles as $article): ?>
                        <article class="blog-card">
                            <div class="blog-card-image">
                                <?php $img = !empty($article['image_url']) ? $article['image_url'] : 'assets/images/placeholder.jpg'; ?>
                                <img src="<?= htmlspecialchars($img) ?>" alt="<?= htmlspecialchars($article['title']) ?>" loading="lazy">
                                <span class="category-badge"><?= htmlspecialchars($article['category']) ?></span>
                            </div>
                            <div class="blog-card-body">
                                <div class="blog-card-meta">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        <?= date('d M Y', strtotime($article['created_at'])) ?>
                                    </span>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <?= htmlspecialchars($article['author']) ?>
                                    </span>
                                </div>
                                <h3><?= htmlspecialchars($article['title']) ?></h3>
                                <p><?= htmlspecialchars($article['excerpt']) ?></p>
                                <a href="article?slug=<?= htmlspecialchars($article['slug']) ?>" class="btn-read-more">
                                    Baca Selengkapnya 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                </a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="blog-empty-state">
                        <h3>Belum ada artikel saat ini.</h3>
                        <p>Silakan kembali lagi nanti untuk membaca artikel terbaru.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <?php include 'assets/components/footer.html'; ?>
    <!-- <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="/" class="footer-logo">
                        <img src="assets/images/logo-jamnasindoo.png?v=999" alt="Jamnasindo"
                            class="footer-logo-img">
                        <span class="footer-brand-text">Jaminan Nasional<br>Indonesia</span>
                    </a>
                    <p>Partner terpercaya untuk mengurus segala kebutuhan perizinan dan konsultasi bisnis Anda dengan
                        profesional dan efisien.</p>
                    <div class="footer-social">
                        <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg></a>
                        <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                                height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg></a>
                        <a href="#" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg></a>
                        <a href="https://wa.me/6281234567890" aria-label="WhatsApp"><svg
                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg></a>
                    </div>
                </div>
                <div>
                    <h4>Layanan</h4>
                    <ul class="footer-links">
                        <li><a href="services">Izin PPIU/PIHK</a></li>
                        <li><a href="services">Izin Kontraktor</a></li>
                        <li><a href="services">Izin VISA</a></li>
                        <li><a href="services">Akreditasi IATA</a></li>
                        <li><a href="services">Bank Garansi</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Perusahaan</h4>
                    <ul class="footer-links">
                        <li><a href="about">Tentang Kami</a></li>
                        <li><a href="blog">Artikel & Berita</a></li>
                        <li><a href="gallery">Galeri</a></li>
                        <li><a href="contact">Hubungi Kami</a></li>
                        <li><a href="contact">Karir</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Kontak</h4>
                    <ul class="footer-contact">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>Jl. Condet Raya No 103E,<br>Kramatjati, Jakarta Timur</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>+62 21 1234 5678</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <span>admin@jamnasindo.id</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Jaminan Nasional Indonesia. All Rights Reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#">Kebijakan Privasi</a>
                    <a href="#">Syarat & Ketentuan</a>
                </div>
            </div>
        </div>
    </footer> -->
    <script src="assets/js/modules/article.js"></script>
    <script src="assets/js/script.js"></script>
</body>

</html>
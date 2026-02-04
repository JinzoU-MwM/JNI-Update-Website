<?php
require_once 'api/config.php';

// Input validation - only allow alphanumeric and hyphens
$slug = filter_input(INPUT_GET, 'slug', FILTER_SANITIZE_STRING) ?? '';
$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($slug));

// Reject empty or invalid slugs
if (empty($slug) || strlen($slug) > 100) {
    header('HTTP/1.0 404 Not Found');
    header('Location: /services');
    exit;
}
$pdo = getDbConnection();

// Fetch Service Data
$stmt = $pdo->prepare("SELECT * FROM services WHERE slug = ?");
$stmt->execute([$slug]);
$service = $stmt->fetch();

if (!$service) {
    header("HTTP/1.0 404 Not Found");
    include '404.html'; // Ensure you have a 404 page or redirect
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($service['title']) ?> - Jamnasindo </title>
    <meta name="description" content="<?= htmlspecialchars($service['short_description']) ?>">
    <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">
    
    <!-- Fonts & CSS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">
    
    <style>
        /* Internal Styles for Service Detail */
        :root {
            --hero-bg: linear-gradient(135deg, #1e4d2b 0%, #387C44 100%);
            --text-hero: #ffffff;
            --section-title-color: #1e293b;
            --accent-green: #387C44;
            --bg-light: #f8fafc;
        }

        /* NAVBAR OVERRIDE FOR SERVICE DETAIL (White on Dark Hero) */
        .navbar {
            background: transparent !important;
            box-shadow: none !important;
        }
        .navbar.scrolled {
            background: white !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        .navbar:not(.scrolled) .navbar-menu a,
        .navbar:not(.scrolled) .brand-text,
        .navbar:not(.scrolled) .lang-selector,
        .navbar:not(.scrolled) .lang-selector span {
            color: #ffffff !important;
        }
        .navbar:not(.scrolled) .navbar-menu a:hover {
            color: rgba(255,255,255,0.8) !important;
        }
        .navbar:not(.scrolled) .navbar-cta {
            background: white !important;
            color: var(--accent-green) !important;
        }

        /* HERO SECTION */
        .service-hero {
            background: var(--hero-bg);
            padding: 180px 0 120px;
            color: var(--text-hero);
            text-align: center;
            position: relative;
            background-size: cover;
            background-position: center;
        }

        .service-hero h1 {
            font-size: 2.8rem;
            font-weight: 700;
            color: #ffffff !important;
            text-shadow: 0 2px 8px rgba(0,0,0,0.2);
            margin-bottom: 16px;
        }
        
        .service-hero p {
            color: rgba(255,255,255,0.9) !important;
            text-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .service-icon-box {
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
            backdrop-filter: blur(12px);
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .service-icon-box svg { 
            width: 4rem; 
            height: 4rem; 
            color: white !important;
            opacity: 0.95; 
        }

        /* LAYOUT & CONTENT */
        .service-content-wrapper {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 60px;
            margin-top: -60px; /* Overlap effect */
            margin-bottom: 80px;
            position: relative;
            z-index: 10;
        }

        .main-content {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--section-title-color);
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f1f5f9;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .section-title::before {
            content: '';
            width: 6px;
            height: 28px;
            background: var(--accent-green);
            border-radius: 4px;
        }

        .prose { 
            color: #475569; 
            line-height: 1.8; 
            font-size: 1.05rem; /* Larger readable text */
        }

        /* REQUIREMENTS LIST */
        .requirements-list {
            list-style: none;
            padding: 0;
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #e2e8f0;
        }

        .requirements-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            color: #334155;
            font-weight: 500;
        }

        .requirements-list li:last-child { margin-bottom: 0; }

        .requirements-list li svg {
            color: var(--accent-green);
            flex-shrink: 0;
            margin-top: 4px;
        }

        /* BENEFIT CARDS */
        .benefit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
        }
        
        .benefit-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.08);
            border-color: var(--accent-green);
        }

        /* SIDEBAR & CTA */
        .sticky-sidebar {
            position: sticky;
            top: 100px; /* User requested adjustment */
            height: fit-content;
        }
        
        .cta-card {
            background: white;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 6px solid var(--accent-green);
        }

        .btn-whatsapp {
            background: #25D366;
            color: white;
            font-weight: 600;
            box-shadow: 0 8px 16px rgba(37, 211, 102, 0.2);
            border: none;
            transition: all 0.3s ease;
        }

        .btn-whatsapp:hover {
            background: #20bd5a;
            transform: translateY(-2px);
            box-shadow: 0 12px 20px rgba(37, 211, 102, 0.3);
            color: white;
        }

        @media (max-width: 991px) {
            .service-content-wrapper { 
                grid-template-columns: 1fr; 
                margin-top: 0;
            }
            
            .main-content {
                padding: 24px;
                box-shadow: none;
                background: transparent;
            }

            .sticky-sidebar { 
                position: static; 
                margin-top: 40px; 
                order: 2; /* Ensure bottom on mobile if flex, default block stacks naturally */
            }
        }
    </style>
</head>
<body>

    <!-- Navbar Loaded via JS -->
    <div id="navbar-placeholder"></div> 
    <script>
        fetch('assets/components/navbar.html').then(r => r.text()).then(h => {
            document.getElementById('navbar-placeholder').innerHTML = h;
            if(window.I18n) window.I18n.init(); 
        });
    </script>

    <header class="service-hero">
        <div class="container">
            <div class="service-icon-box">
                <?= $service['icon_svg'] ?>
            </div>
            <h1><?= htmlspecialchars($service['title']) ?></h1>
            <p class="mt-3 opacity-90" style="max-width: 600px; margin: 0 auto; font-size: 1.1rem;">
                <?= htmlspecialchars($service['short_description']) ?>
            </p>
        </div>
    </header>

    <main class="container">
        <div class="service-content-wrapper">
            <!-- Left: Main Content -->
            <div class="main-content">
                
                <!-- Section A: Tentang Layanan -->
                <div class="content-section">
                    <h2 class="section-title">Tentang Layanan</h2>
                    <div class="prose">
                        <?= $service['full_description'] ?>
                    </div>
                </div>

                <!-- Section B: Persyaratan -->
                <?php if($service['requirements']): ?>
                <div class="content-section">
                    <h2 class="section-title">Persyaratan Dokumen</h2>
                    <div class="requirements-list">
                        <!-- We assume requirements are HTML <ul> or text. If text, we might need parsing. 
                             For now, wrapping in a styled div. If database has clean text, we should ideally explode it.
                             Assuming HTML content from TinyMCE. -->
                        <?= $service['requirements'] ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Section C: Keuntungan -->
                <?php if($service['benefits']): ?>
                <div class="content-section">
                    <h2 class="section-title">Keuntungan Layanan Kami</h2>
                    <div class="benefit-grid">
                        <!-- If benefits is HTML, render as-is. Otherwise, we'd parse. -->
                        <div class="benefit-card">
                            <div class="benefit-icon" style="color: var(--accent-green); font-size: 2rem; margin-bottom: 12px;">✓</div>
                            <div class="prose"><?= $service['benefits'] ?></div>
                        </div>
                    </div>
                </div>
                <?php endif; ?>

            </div>

            <!-- Right: Sidebar -->
            <aside class="sticky-sidebar">
                <div class="cta-card">
                    <h3 class="mb-3">Butuh Bantuan?</h3>
                    <p class="text-muted mb-4">Konsultasikan kebutuhan legalitas Anda secara gratis bersama ahli kami.</p>
                    
                    <a href="https://wa.me/6281234567890?text=Halo JNI, saya ingin konsultasi mengenai <?= urlencode($service['title']) ?>" 
                       class="btn btn-whatsapp w-100 mb-3 py-3" target="_blank">
                       <i class="bi bi-whatsapp me-2"></i> Chat WhatsApp
                    </a>
                    
                    <a href="contact" class="btn btn-outline-primary w-100 py-3">Hubungi Kami</a>
                </div>
            </aside>
        </div>
    </main>

    <!-- Footer -->
    <?php include 'assets/components/footer.html'; ?>

    <!-- Scripts -->
    <script src="assets/js/modules/i18n.js?v=<?= time() ?>"></script>
    <script src="assets/js/script.js"></script>
</body>
</html>

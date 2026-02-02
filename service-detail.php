<?php
require_once 'api/config.php';

$slug = $_GET['slug'] ?? '';
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
    <title><?= htmlspecialchars($service['title']) ?> - JNI Consultant</title>
    <meta name="description" content="<?= htmlspecialchars($service['short_description']) ?>">
    <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">
    
    <!-- Fonts & CSS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    
    <style>
        /* Internal Styles for Service Detail */
        .service-hero {
            background: linear-gradient(135deg, #1e4d2b 0%, #387C44 100%);
            padding: 180px 0 100px;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .service-hero::after {
            content: '';
            position: absolute;
            bottom: -50px;
            left: 0;
            width: 100%;
            height: 100px;
            background: white;
            border-radius: 50% 50% 0 0 / 100% 100% 0 0;
        }

        .service-icon-box {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(5px);
        }
        
        .service-icon-box svg { color: white; width: 40px; height: 40px; }

        .service-content-wrapper {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 50px;
            margin-top: 60px;
            margin-bottom: 80px;
        }

        /* Main Content Styling */
        .content-section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: #387C44;
            border-radius: 2px;
        }

        /* HTML Content Styling */
        .prose { color: #475569; line-height: 1.8; }
        .prose ul { padding-left: 20px; margin-bottom: 15px; }
        .prose li { margin-bottom: 8px; }

        /* Benefit Cards */
        .benefit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .benefit-card {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(56, 124, 68, 0.1);
        }

        /* Sidebar Styling */
        .sticky-sidebar {
            position: sticky;
            top: 100px;
            height: fit-content;
        }
        
        .cta-card {
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            text-align: center;
            border-top: 5px solid #387C44;
        }

        @media (max-width: 991px) {
            .service-content-wrapper { grid-template-columns: 1fr; }
            .sticky-sidebar { position: static; margin-top: 40px; }
        }
    </style>
</head>
<body>

    <!-- Navbar (Will be injected or assume standard navbar included if using PHP include) -->
    <!-- Ideally, you should have a header.php, but for now I'll use the JS loader or manual Nav -->
    <div id="navbar-placeholder"></div> 
    <!-- Reuse existing navbar via JS or include if you refactored -->
    <script>
        // Quick fetch to load navbar if not using PHP includes yet
        fetch('assets/components/navbar.html').then(r => r.text()).then(h => {
            document.getElementById('navbar-placeholder').innerHTML = h;
            // Re-init functionality
            if(window.I18n) window.I18n.init(); 
        });
    </script>
    <!-- Assuming standard script.js handles the navbar behavior -->

    <header class="service-hero">
        <div class="container">
            <div class="service-icon-box">
                <?= $service['icon_svg'] ?>
            </div>
            <h1><?= htmlspecialchars($service['title']) ?></h1>
            <p class="mt-3 opacity-75" style="max-width: 600px; margin: 0 auto;">
                <?= htmlspecialchars($service['short_description']) ?>
            </p>
        </div>
    </header>

    <main class="container">
        <div class="service-content-wrapper">
            <!-- Left: Main Content -->
            <div class="main-content">
                
                <!-- Description -->
                <div class="content-section">
                    <h2 class="section-title">Tentang Layanan</h2>
                    <div class="prose">
                        <?= $service['full_description'] ?>
                    </div>
                </div>

                <!-- Requirements -->
                <?php if($service['requirements']): ?>
                <div class="content-section">
                    <h2 class="section-title">Dokumen & Persyaratan</h2>
                    <div class="benefit-card prose">
                        <?= $service['requirements'] ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Benefits -->
                <?php if($service['benefits']): ?>
                <div class="content-section">
                    <h2 class="section-title">Keuntungan Layanan Kami</h2>
                    <div class="prose">
                        <?= $service['benefits'] ?>
                    </div>
                </div>
                <?php endif; ?>

            </div>

            <!-- Right: Sidebar -->
            <aside class="sticky-sidebar">
                <div class="cta-card">
                    <h3>Butuh Layanan Ini?</h3>
                    <p class="text-muted mb-4">Tim ahli kami siap membantu proses perizinan Anda sampai tuntas.</p>
                    
                    <a href="https://wa.me/6281234567890?text=Halo JNI, saya ingin konsultasi mengenai <?= urlencode($service['title']) ?>" 
                       class="btn btn-primary w-100 mb-3" target="_blank">
                       <i class="bi bi-whatsapp"></i> Konsultasi via WhatsApp
                    </a>
                    
                    <a href="contact" class="btn btn-outline w-100">Hubungi Kami</a>
                </div>
            </aside>
        </div>
    </main>

    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>
     <script>
        fetch('assets/components/footer.html').then(r => r.text()).then(h => {
            document.getElementById('footer-placeholder').innerHTML = h;
        });
    </script>

    <!-- Scripts -->
    <script src="assets/js/modules/i18n.js"></script>
    <script src="assets/js/script.js"></script>
</body>
</html>

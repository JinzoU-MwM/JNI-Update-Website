<?php
require_once 'api/config.php';
require_once 'api/tracker.php';

// 1. Define Default Static Array
$services = [
    [
        'title' => 'Izin PPIU/PIHK',
        'slug' => 'izin-ppiu-pihk',
        'short_description' => 'Pengurusan izin penyelenggara perjalanan ibadah umrah dan haji khusus resmi.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14M9 9h1M9 13h1M9 17h1M17 9h1M17 13h1M17 17h1" /></svg>'
    ],
    [
        'title' => 'Izin Kontraktor',
        'slug' => 'izin-kontraktor',
        'short_description' => 'Layanan pembuatan SBU, SIUJK, dan sertifikasi kontraktor lainnya sesuai regulasi.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" /><rect x="9" y="10" width="2" height="2" /><rect x="13" y="10" width="2" height="2" /></svg>'
    ],
    [
        'title' => 'Izin VISA',
        'slug' => 'izin-visa',
        'short_description' => 'Bantuan pengurusan VISA kerja, bisnis, dan kunjungan dengan proses cepat.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4M14 15h4" /></svg>'
    ],
    [
        'title' => 'Akreditasi IATA',
        'slug' => 'akreditasi-iata',
        'short_description' => 'Pendampingan proses akreditasi IATA untuk kredibilitas travel agent Anda.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>'
    ],
    [
        'title' => 'Bank Garansi',
        'slug' => 'bank-garansi',
        'short_description' => 'Penerbitan Bank Garansi dan asuransi proyek dengan syarat mudah dan transparan.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M7 8V6a5 5 0 0110 0v2" /><circle cx="12" cy="14" r="2" /></svg>'
    ],
    [
        'title' => 'Laporan Keuangan',
        'slug' => 'laporan-keuangan',
        'short_description' => 'Penyusunan laporan keuangan perusahaan yang valid dan akuntabel oleh ahli.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8M10 9h4" /></svg>'
    ],
    [
        'title' => 'Perpajakan',
        'slug' => 'perpajakan',
        'short_description' => 'Konsultasi pajak bulanan dan tahunan untuk ketaatan pajak perusahaan Anda.',
        'icon_svg' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>'
    ]
];

// 2. Database Override
try {
    $pdo = getDbConnection();
    // LIMIT 7 as requested
    $stmt = $pdo->query("SELECT title, slug, short_description, icon_svg, image_url, created_at FROM services ORDER BY created_at ASC LIMIT 7");
    $dbServices = $stmt->fetchAll();
    
    if ($dbServices && count($dbServices) > 0) {
        $services = $dbServices;
    }
} catch (Exception $e) {
    // Silent fail; continue using $services static array
    error_log("Services Fetch Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
    content="JNI Consultant - Konsultan Profesional untuk Perizinan Usaha, PPIU/PIHK, Kontraktor, VISA, Akreditasi IATA, dan Layanan Keuangan di Indonesia.">
  <meta name="keywords"
    content="konsultan bisnis, izin PPIU, izin PIHK, izin kontraktor, visa, akreditasi IATA, bank garansi, laporan keuangan, perpajakan, Indonesia">
  <meta name="author" content="JNI Consultant">
  <meta name="robots" content="index, follow">

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="JNI Consultant - Solusi Perizinan & Konsultasi Bisnis">
  <meta property="og:description"
    content="Partner terpercaya untuk mengurus segala kebutuhan perizinan dan konsultasi bisnis Anda.">
  <meta property="og:image" content="assets/images/og-image.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="assets/css/style.css">

  <title>Jaminan Nasional Indonesia - Solusi Perizinan & Konsultasi Bisnis Profesional</title>

  <!-- Schema Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Jaminan Nasional Indonesia",
    "description": "Konsultan profesional untuk perizinan usaha dan konsultasi bisnis",
    "url": "https://www.jamnasindo.id",
    "telephone": "+62-21-1234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Sudirman No. 123",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "10220",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-6.2088",
      "longitude": "106.8456"
    },
    "sameAs": [
      "https://www.facebook.com/jniconsultant",
      "https://www.instagram.com/jniconsultant",
      "https://www.linkedin.com/company/jniconsultant"
    ]
  }
  </script>
</head>

<body>

  <!-- ===== NAVBAR - EASTUTE STYLE ===== -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <!-- LEFT: Brand Logo -->
      <div class="navbar-brand">
        <a href="/">
          <img src="assets/images/logo-jabat.png" alt="Jaminan Nasional Indonesia" class="logo-img">
          <span class="brand-text">Jaminan Nasional<br>Indonesia</span>
        </a>
      </div>
      <!-- CENTER: Navigation Links -->
      <div class="navbar-center">
        <ul class="navbar-menu">
          <li><a href="/" class="active" data-i18n="nav_home">Beranda</a></li>
          <li><a href="services" data-i18n="nav_services">Layanan</a></li>
          <li><a href="about" data-i18n="nav_about">Tentang Kami</a></li>
          <li><a href="blog" data-i18n="nav_blog">Artikel</a></li>
          <li><a href="gallery" data-i18n="nav_gallery">Galeri</a></li>
          <li><a href="contact" data-i18n="nav_contact">Kontak</a></li>
        </ul>
      </div>

      <!-- RIGHT: Action Group -->
      <div class="navbar-actions">
        <!-- Language Selector -->
        <button class="lang-selector">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>ID</span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <!-- CTA Button -->
        <a href="contact" class="navbar-cta" data-i18n="nav_cta">Konsultasi</a>
      </div>

      <!-- Mobile Toggle -->
      <button class="navbar-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>



  <!-- ===== HERO SECTION ===== -->
  <section class="hero" id="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-badge" data-i18n="hero_badge">🏆 Konsultan Terpercaya Sejak 2017</span>
        <h1>Solusi <span>Perizinan</span> & Konsultasi Bisnis Profesional</h1>
        <p data-i18n="hero_desc">Kami membantu mengurus segala kebutuhan perizinan usaha Anda dengan cepat, tepat, dan
          terpercaya. Mulai dari
          izin PPIU, kontraktor, hingga layanan keuangan.</p>
        <div class="hero-buttons">
          <a href="contact" class="btn btn-primary" data-i18n="hero_btn_primary">Konsultasi Gratis</a>
          <a href="services" class="btn btn-outline" data-i18n="hero_btn_outline">Lihat Layanan</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <h3>500+</h3>
            <p data-i18n="stat_projects">Proyek Selesai</p>
          </div>
          <div class="hero-stat">
            <h3>98%</h3>
            <p data-i18n="stat_success">Tingkat Keberhasilan</p>
          </div>
          <div class="hero-stat">
            <h3>15+</h3>
            <p data-i18n="stat_exp">Tahun Pengalaman</p>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=500&fit=crop"
          alt="Tim Konsultan Profesional JNI">
      </div>
    </div>

    <!-- Wave Divider -->
    <div class="wave-divider">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.28,267.34,49.25,293.73,55.81,321.39,56.44Z"
          class="shape-fill"></path>
      </svg>
    </div>
  </section>

  <!-- ===== TRUSTED BY / KLIEN KAMI SECTION ===== -->
  <?php
  // Fetch client logos
  $clientLogos = [];
  try {
      $clientStmt = $pdo->query("SELECT client_name, logo_path FROM clients ORDER BY created_at ASC");
      $clientLogos = $clientStmt->fetchAll();
  } catch (Exception $e) {
      // Silent fail - table might not exist yet
  }
  ?>
  <?php if (count($clientLogos) > 0): ?>
  <section class="section clients-section" id="clients">
    <style>
      .clients-section {
        background: #f8fafc;
        padding: 60px 0;
      }
      .clients-section .section-header {
        text-align: center;
        margin-bottom: 40px;
      }
      .clients-section .section-header h2 {
        font-size: 1.8rem;
        color: #1e293b;
      }
      .clients-section .section-header p {
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
      }
      .clients-grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(6, 1fr);
        max-width: 1140px;
        margin: 0 auto;
        padding: 0 20px;
      }
      @media (max-width: 991px) {
        .clients-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      @media (max-width: 576px) {
        .clients-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .client-logo {
        background: white;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        transition: all 0.3s ease;
      }
      .client-logo img {
        max-width: 100%;
        max-height: 60px;
        object-fit: contain;
        filter: grayscale(100%);
        opacity: 0.6;
        transition: all 0.3s ease;
      }
      .client-logo:hover {
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        transform: translateY(-4px);
      }
      .client-logo:hover img {
        filter: grayscale(0%);
        opacity: 1;
      }
    </style>
    <div class="container">
      <div class="section-header">
        <span class="section-badge">Dipercaya Oleh</span>
        <h2>Klien <span>Kami</span></h2>
        <p>Berbagai perusahaan dan instansi telah mempercayakan kebutuhan perizinan mereka kepada kami.</p>
      </div>
      <div class="clients-grid">
        <?php foreach ($clientLogos as $client): ?>
          <div class="client-logo" title="<?= htmlspecialchars($client['client_name']) ?>">
            <img src="<?= htmlspecialchars($client['logo_path']) ?>" alt="<?= htmlspecialchars($client['client_name']) ?>" loading="lazy">
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- ===== SERVICES SECTION (PHP DYNAMIC) ===== -->
  <section class="section services" id="services">
    <div class="container">
      <div class="section-header">
        <span class="section-badge" data-i18n="services_badge">Layanan Kami</span>
        <h2>Solusi Lengkap untuk <span>Kebutuhan Bisnis</span> Anda</h2>
        <p data-i18n="services_desc">Kami menyediakan berbagai layanan konsultasi dan perizinan untuk membantu bisnis
          Anda berkembang dengan legal
          dan profesional.</p>
      </div>
      <div class="services-grid">
        <?php foreach ($services as $svc): ?>
        <a href="service-detail.php?slug=<?= htmlspecialchars($svc['slug']) ?>" class="service-card">
          <div class="service-icon">
            <?= $svc['icon_svg'] // SVG should be safe if providing from trustworthy sources or sanitized ?>
          </div>
          <h3><?= htmlspecialchars($svc['title']) ?></h3>
          <p><?= htmlspecialchars($svc['short_description']) ?></p>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ===== WHY US SECTION ===== -->
  <section class="section why-us" id="why-us">
    <div class="container">
      <div class="section-header">
        <span class="section-badge" data-i18n="why_badge">Mengapa Kami</span>
        <h2>Alasan Memilih <span>JNI Consultant</span></h2>
        <p data-i18n="why_desc">Dengan pengalaman lebih dari 15 tahun, kami telah membantu ratusan perusahaan dalam
          mengurus perizinan dan
          kebutuhan bisnis mereka.</p>
      </div>

      <!-- Block 1: Image Left, Text Right -->
      <div class="why-block">
        <div class="why-image">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=550&h=400&fit=crop"
            alt="Tim Profesional JNI Consultant">
        </div>
        <div class="why-content">
          <h2>Tim Profesional dan <span>Berpengalaman</span></h2>
          <p data-i18n="why_team_desc">Kami memiliki tim konsultan yang ahli di bidangnya dengan rekam jejak yang
            terbukti dalam menangani
            berbagai kasus perizinan.</p>
          <ul class="why-list">
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Konsultan bersertifikasi dan berpengalaman lebih dari 10 tahun</span>
            </li>
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Memahami regulasi terbaru di berbagai sektor industri</span>
            </li>
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Jaringan luas dengan instansi pemerintah terkait</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Block 2: Text Left, Image Right (Reversed) -->
      <div class="why-block reverse">
        <div class="why-image">
          <img src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=550&h=400&fit=crop"
            alt="Proses Cepat dan Terpercaya">
        </div>
        <div class="why-content">
          <h2>Proses Cepat dan <span>Transparan</span></h2>
          <p data-i18n="why_fast_desc">Kami berkomitmen memberikan layanan yang cepat dengan proses yang transparan,
            sehingga Anda dapat fokus
            pada bisnis utama Anda.</p>
          <ul class="why-list">
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Estimasi waktu penyelesaian yang jelas dan realistis</span>
            </li>
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Update progress secara berkala melalui berbagai channel</span>
            </li>
            <li>
              <span class="check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>Biaya transparan tanpa biaya tersembunyi</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TESTIMONIALS SECTION (Dual-Row Marquee) ===== -->
  <section class="section testimonials" id="testimonials">
    <div class="container-fluid" style="padding: 0;">
      <div class="section-header">
        <span class="section-badge" data-i18n="testi_badge">Testimoni</span>
        <h2>Apa Kata <span>Klien Kami</span></h2>
        <p data-i18n="testi_desc">Kepuasan klien adalah prioritas utama kami. Berikut adalah pengalaman mereka bekerja
          sama dengan JNI Consultant.</p>
      </div>

      <div class="testimonials-marquee-wrapper">
        <!-- Top Row: Scrolls RIGHT -->
        <div class="marquee-row">
          <div class="marquee-track scroll-right" id="marquee-track-1">
            <!-- JS will populate this -->
          </div>
        </div>

        <!-- Bottom Row: Scrolls LEFT -->
        <div class="marquee-row">
          <div class="marquee-track scroll-left" id="marquee-track-2">
            <!-- JS will populate this -->
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ===== CTA SECTION ===== -->
  <section class="cta">
    <div class="container">
      <h2 data-i18n="cta_title">Siap Memulai Konsultasi?</h2>
      <p data-i18n="cta_desc">Hubungi kami sekarang untuk mendapatkan konsultasi gratis dan solusi terbaik untuk
        kebutuhan perizinan bisnis
        Anda.</p>
      <a href="contact" class="btn btn-white" data-i18n="cta_btn">Hubungi Kami Sekarang</a>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <!-- ===== FOOTER ===== -->
  <?php include 'assets/components/footer.html'; ?>

  <!-- JavaScript -->
  <script src="assets/js/script.js"></script>
  <script src="assets/js/modules/i18n.js"></script>
  <script src="assets/js/modules/testimonials-loader.js"></script>
  
</body>

</html>

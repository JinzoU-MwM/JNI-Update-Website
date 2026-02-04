<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Layanan Konsultan JNI - Izin PPIU, PIHK, Kontraktor, VISA, Akreditasi IATA, Bank Garansi, dan Perpajakan.">
    <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">
    <title>Layanan Kami - Jamnasindo</title>
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
                    <li><a href="services" class="active">Layanan</a></li>
                    <li><a href="about">Tentang Kami</a></li>
                    <li><a href="blog">Artikel</a></li>
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
            <h1>Layanan Kami</h1>
            <div class="breadcrumb">
                <a href="/">Beranda</a>
                <span class="breadcrumb-separator">/</span>
                <span>Layanan</span>
            </div>
        </div>
    </section>

    <section class="section services-page">
        <div class="container">
            <div class="section-header">
                <span class="section-badge">Layanan Lengkap</span>
                <h2>Solusi Profesional untuk <span>Kebutuhan Bisnis</span></h2>
            </div>

            <!-- Category Filter Tabs -->
            <div class="services-tabs">
                <button class="tab-btn active" data-category="legal">Legalitas & Perizinan</button>
                <button class="tab-btn" data-category="finance">Keuangan & Administrasi</button>
            </div>

            <!-- Services Grid -->
            <div class="services-grid">
                <!-- CATEGORY: Legalitas & Perizinan -->
                <div class="service-card" data-category="legal">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14" />
                        </svg>
                    </div>
                    <h3>Izin PPIU & PIHK</h3>
                    <p>Pengurusan izin Penyelenggara Perjalanan Ibadah Umrah dan Haji Khusus dengan proses cepat dan
                        legal.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="legal">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" />
                        </svg>
                    </div>
                    <h3>Izin Kontraktor</h3>
                    <p>Pengurusan SBU, SIUJK, NIB Konstruksi, dan berbagai izin kontraktor sesuai standar LPJK.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="legal">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </div>
                    <h3>Izin VISA</h3>
                    <p>Layanan pengurusan visa untuk bisnis, wisata, kunjungan kerja, dan studi ke berbagai negara.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="legal">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </div>
                    <h3>Akreditasi IATA</h3>
                    <p>Pendampingan lengkap untuk mendapatkan akreditasi IATA bagi agen perjalanan wisata.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <!-- CATEGORY: Keuangan & Administrasi -->
                <div class="service-card" data-category="finance">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="3" y="8" width="18" height="12" rx="2" />
                            <path d="M7 8V6a5 5 0 0110 0v2" />
                        </svg>
                    </div>
                    <h3>Bank Garansi</h3>
                    <p>Jaminan bank garansi untuk tender, jaminan pelaksanaan, uang muka, dan pemeliharaan proyek.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="finance">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M8 13h8M8 17h8" />
                        </svg>
                    </div>
                    <h3>Laporan Keuangan</h3>
                    <p>Penyusunan laporan keuangan sesuai standar akuntansi untuk audit dan pelaporan pajak.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="finance">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                    </div>
                    <h3>Perpajakan</h3>
                    <p>Konsultasi pajak, pelaporan SPT, perhitungan PPh/PPN, dan pendampingan pemeriksaan pajak.</p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>

                <div class="service-card" data-category="finance">
                    <div class="service-icon-wrap">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M9 7h6M9 11h6M9 15h4" />
                            <rect x="4" y="3" width="16" height="18" rx="2" />
                        </svg>
                    </div>
                    <h3>Administrasi Bisnis</h3>
                    <p>Pengurusan dokumen legalitas perusahaan, NPWP, NIB, dan kelengkapan administrasi bisnis lainnya.
                    </p>
                    <a href="contact.html" class="btn-card">Konsultasi</a>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Butuh Bantuan Layanan Khusus?</h2>
            <p>Hubungi kami untuk konsultasi gratis.</p>
            <a href="contact.html" class="btn btn-white">Hubungi Kami</a>
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
    <script src="assets/js/script.js"></script>
    <script src="assets/js/modules/services-filter.js"></script>
</body>

</html>
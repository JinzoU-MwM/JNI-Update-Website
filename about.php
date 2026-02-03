<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Tentang JNI Consultant - Profil perusahaan konsultan perizinan dan bisnis terpercaya di Indonesia.">
    <link rel="icon" type="image/png" href="assets/images/logo-jabat.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css?v=2.0">
    <title>Tentang Kami - JNI Consultant</title>
</head>

<body>
    <!-- ===== NAVBAR - EASTUTE STYLE (Inner Page) ===== -->
    <nav class="navbar nav-inner" id="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a href="/">
                    <img src="assets/images/logo-jabat.png" alt="Jaminan Nasional Indonesia" class="logo-img">
                    <span class="brand-text">Jaminan Nasional<br>Indonesia</span>
                </a>
            </div>
            <div class="navbar-center">
                <ul class="navbar-menu">
                    <li><a href="/">Beranda</a></li>
                    <li><a href="services">Layanan</a></li>
                    <li><a href="about" class="active">Tentang Kami</a></li>
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
            <h1>Tentang Kami</h1>
            <div class="breadcrumb">
                <a href="/">Beranda</a>
                <span class="breadcrumb-separator">/</span>
                <span>Tentang Kami</span>
            </div>
        </div>
    </section>

    <section class="section about-intro">
        <div class="container">
            <div class="about-grid">
                <div class="about-image">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=550&h=400&fit=crop"
                        alt="Tim JNI Consultant">
                </div>
                <div class="about-content">
                    <h2>Konsultan Bisnis <span>Terpercaya</span> Sejak 2010</h2>
                    <p>JNI Consultant adalah perusahaan konsultan yang berfokus pada layanan perizinan usaha dan
                        konsultasi bisnis. Dengan pengalaman lebih dari 15 tahun, kami telah membantu ratusan perusahaan
                        dalam mengurus berbagai kebutuhan perizinan.</p>
                    <p>Kami berkomitmen memberikan layanan profesional dengan proses yang transparan dan hasil yang
                        memuaskan. Tim kami terdiri dari para ahli yang berpengalaman di bidangnya masing-masing.</p>
                    <ul class="why-list">
                        <li><span class="check-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg></span><span>500+ proyek berhasil diselesaikan</span></li>
                        <li><span class="check-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg></span><span>98% tingkat kepuasan klien</span></li>
                        <li><span class="check-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg></span><span>Tim profesional bersertifikasi</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section class="section team" id="team">
        <style>
            /* Team Refactor Styles (Scoped) */
            .team-grid-v2 {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 30px;
                justify-content: center;
                max-width: 800px; /* Limiting width for just 2 cards to look good */
                margin: 0 auto;
            }
            
            .team-card-v2 {
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                height: 100%;
            }
            
            .team-card-v2:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0,0,0,0.1);
            }
            
            .team-image-container {
                height: 320px;
                width: 100%;
                overflow: hidden;
                position: relative;
                background-color: #f1f5f9;
            }
            
            .team-image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center top; 
                transition: transform 0.5s ease;
            }
            
            .team-card-v2:hover .team-image-container img {
                transform: scale(1.05);
            }
            
            .team-content {
                padding: 24px;
                text-align: center;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .team-content h3 {
                font-size: 1.35rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 8px;
            }
            
            .team-role {
                color: #1e4d2b; /* Theme Green */
                font-weight: 600;
                font-size: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
        <div class="container">
            <div class="section-header">
                <span class="section-badge">Tim Kami</span>
                <h2>Para Ahli di <span>Balik Kesuksesan</span> Anda</h2>
            </div>
            <div class="team-grid-v2">
                <!-- Card 1: Bondra Uji Pratama -->
                <div class="team-card-v2">
                    <div class="team-image-container">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" 
                             alt="Bondra Uji Pratama" loading="lazy">
                    </div>
                    <div class="team-content">
                        <h3>Bondra Uji Pratama</h3>
                        <span class="team-role">Direktur</span>
                    </div>
                </div>
                
                <!-- Card 2: Fandi Rachmat -->
                <div class="team-card-v2">
                    <div class="team-image-container">
                        <img src="public/uploads/photo/Fandi.jpg" 
                             alt="Fandi Rachmat" loading="lazy">
                    </div>
                    <div class="team-content">
                        <h3>Fandi Rachmat</h3>
                        <span class="team-role">Komisaris</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Ingin Bergabung dengan Tim Kami?</h2>
            <p>Kami selalu mencari talenta terbaik untuk bergabung.</p>
            <a href="contact" class="btn btn-white">Hubungi Kami</a>
        </div>
    </section>

    <?php include 'assets/components/footer.html'; ?>
    <!-- <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="/" class="footer-logo">
                        <img src="assets/images/logo-jabat.png" alt="Jaminan Nasional Indonesia"
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
</body>

</html>
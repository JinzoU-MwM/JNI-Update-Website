<svelte:head>
  <title>Tentang Kami - Jamnasindo</title>
  <meta name="description" content="PT Jaminan Nasional Indonesia (JNI) adalah konsultan perizinan dan legalitas bisnis terpercaya dengan pengalaman lebih dari 10 tahun." />
  <link rel="canonical" href="https://jamnasindo.id/about" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://jamnasindo.id/about" />
  <meta property="og:title" content="Tentang Kami - Jamnasindo" />
  <meta property="og:description" content="PT Jaminan Nasional Indonesia (JNI) adalah konsultan perizinan dan legalitas bisnis terpercaya dengan pengalaman lebih dari 10 tahun." />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

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

<!-- About Content -->
<section class="section">
  <div class="container">
    <div class="about-grid">
      <div class="about-content">
        <span class="section-badge">Sejak 2013</span>
        <h2>PT Jaminan Nasional Indonesia</h2>
        <p>Kami adalah perusahaan konsultan perizinan dan legalitas bisnis terpercaya yang telah berdiri sejak tahun 2013. Dengan pengalaman lebih dari 10 tahun, kami telah membantu ratusan perusahaan di Indonesia untuk mengurus berbagai kebutuhan perizinan dan legalitas mereka.</p>
        <p>Tim kami terdiri dari para profesional berpengalaman di bidang hukum, perpajakan, dan administrasi bisnis yang siap membantu Anda mengatasi segala tantangan perizinan.</p>

        <div class="about-stats">
          <div class="about-stat">
            <span class="about-stat-number">500+</span>
            <span class="about-stat-label">Klien Terlayani</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-number">10+</span>
            <span class="about-stat-label">Tahun Pengalaman</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-number">50+</span>
            <span class="about-stat-label">Tim Profesional</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-number">8</span>
            <span class="about-stat-label">Layanan Utama</span>
          </div>
        </div>
      </div>

      <div class="about-image-area">
        <div class="about-image-placeholder">
          <div class="about-pattern">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6">
              <path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14" />
            </svg>
            <span>Gedung JNI Consultant</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Values -->
<section class="section" style="background:var(--bg-light);">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Nilai Kami</span>
      <h2>Mengapa Memilih <span>JNI?</span></h2>
    </div>

    <div class="values-grid">
      <div class="value-card">
        <div class="value-icon">🏆</div>
        <h3>Profesional</h3>
        <p>Tim ahli bersertifikasi dengan pengalaman bertahun-tahun di bidang perizinan dan legalitas.</p>
      </div>
      <div class="value-card">
        <div class="value-icon">⚡</div>
        <h3>Cepat & Efisien</h3>
        <p>Proses pengurusan yang cepat dan efisien dengan timeline yang jelas dan terukur.</p>
      </div>
      <div class="value-card">
        <div class="value-icon">🔒</div>
        <h3>Transparan</h3>
        <p>Biaya dan proses yang transparan tanpa biaya tersembunyi. Update berkala untuk setiap tahapan.</p>
      </div>
      <div class="value-card">
        <div class="value-icon">🤝</div>
        <h3>Terpercaya</h3>
        <p>Reputasi yang telah teruji, dipercaya oleh ratusan perusahaan di berbagai sektor industri.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="container">
    <h2>Mari Bekerja Sama</h2>
    <p>Hubungi kami dan konsultasikan kebutuhan perizinan bisnis Anda secara gratis.</p>
    <a href="/contact" class="btn btn-white">Hubungi Kami</a>
  </div>
</section>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .about-content h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 12px 0 20px;
  }

  .about-content p {
    color: var(--text);
    line-height: 1.8;
    margin-bottom: 16px;
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 32px;
  }

  .about-stat {
    background: var(--bg-light);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
  }

  .about-stat-number {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary);
  }

  .about-stat-label {
    font-size: 0.85rem;
    color: var(--text-light);
  }

  .about-image-placeholder {
    background: linear-gradient(135deg, var(--primary-dark), var(--primary));
    border-radius: 20px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about-pattern {
    text-align: center;
    color: white;
    opacity: 0.8;
  }

  .about-pattern span {
    display: block;
    margin-top: 12px;
    font-size: 0.9rem;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .value-card {
    background: white;
    padding: 32px;
    border-radius: 16px;
    border: 1px solid var(--border);
    text-align: center;
    transition: all 0.3s ease;
  }

  .value-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .value-icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }

  .value-card h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 10px;
  }

  .value-card p {
    color: var(--text-light);
    font-size: 0.9rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .about-image-placeholder {
      height: 250px;
    }
  }
</style>

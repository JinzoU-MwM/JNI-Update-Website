<script lang="ts">
  import { fetchAPI } from '$lib/api';

  let { data } = $props();

  let form = $state({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    message: '',
  });

  let submitting = $state(false);
  let success = $state(false);
  let errorMsg = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    errorMsg = '';
    
    try {
      await fetchAPI('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      success = true;
      form = { name: '', email: '', phone: '', service_type: '', message: '' };
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan, coba lagi.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Hubungi Kami - Jamnasindo</title>
  <meta name="description" content="Hubungi JNI Consultant untuk konsultasi kebutuhan perizinan dan legalitas bisnis Anda." />
</svelte:head>

<section class="page-header">
  <div class="container">
    <h1>Hubungi Kami</h1>
    <div class="breadcrumb">
      <a href="/">Beranda</a>
      <span class="breadcrumb-separator">/</span>
      <span>Kontak</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="contact-grid">
      <!-- Contact Form -->
      <div class="contact-form-wrapper">
        <h2>Kirim Pesan</h2>
        <p>Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda.</p>

        {#if success}
          <div class="alert alert-success">
            ✅ Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
          </div>
        {/if}

        {#if errorMsg}
          <div class="alert alert-error">
            ❌ {errorMsg}
          </div>
        {/if}

        <form onsubmit={handleSubmit}>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nama Lengkap *</label>
              <input type="text" id="name" bind:value={form.name} required placeholder="Nama Anda" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" bind:value={form.email} placeholder="email@contoh.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">No. Telepon</label>
              <input type="tel" id="phone" bind:value={form.phone} placeholder="08xx xxxx xxxx" />
            </div>
            <div class="form-group">
              <label for="service">Layanan</label>
              <select id="service" bind:value={form.service_type}>
                <option value="">Pilih Layanan</option>
                {#each data.services as service}
                  <option value={service.title}>{service.title}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="message">Pesan *</label>
            <textarea id="message" bind:value={form.message} required rows="5" placeholder="Tuliskan kebutuhan Anda..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" disabled={submitting}>
            {submitting ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <div class="info-card">
          <h3>Informasi Kontak</h3>
          <ul>
            <li>
              <span class="info-icon">📍</span>
              <div>
                <strong>Alamat</strong>
                <p>Jl. Condet Raya No 103E, Kramatjati, Jakarta Timur</p>
              </div>
            </li>
            <li>
              <span class="info-icon">📞</span>
              <div>
                <strong>Telepon</strong>
                <p>+62 21 1234 5678</p>
              </div>
            </li>
            <li>
              <span class="info-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>admin@jamnasindo.id</p>
              </div>
            </li>
            <li>
              <span class="info-icon">⏰</span>
              <div>
                <strong>Jam Kerja</strong>
                <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
              </div>
            </li>
          </ul>
        </div>

        <a href="https://wa.me/6281234567890" class="whatsapp-card" target="_blank">
          <span class="wa-icon">💬</span>
          <div>
            <strong>Chat WhatsApp</strong>
            <p>Respon cepat dalam 5 menit</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 48px;
  }

  .contact-form-wrapper h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 8px;
  }

  .contact-form-wrapper > p {
    color: var(--text-light);
    margin-bottom: 32px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 6px;
    font-size: 0.9rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
    color: var(--text);
    background: white;
    transition: all 0.3s ease;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(56, 124, 68, 0.1);
  }

  textarea {
    resize: vertical;
  }

  .alert {
    padding: 14px 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-weight: 500;
  }

  .alert-success {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .alert-error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .info-card {
    background: white;
    padding: 32px;
    border-radius: 16px;
    border: 1px solid var(--border);
    margin-bottom: 20px;
  }

  .info-card h3 {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 24px;
  }

  .info-card ul {
    list-style: none;
  }

  .info-card li {
    display: flex;
    gap: 14px;
    margin-bottom: 20px;
  }

  .info-card li:last-child {
    margin-bottom: 0;
  }

  .info-icon {
    font-size: 1.5rem;
    margin-top: 2px;
  }

  .info-card strong {
    display: block;
    font-size: 0.9rem;
    color: var(--text-dark);
    margin-bottom: 2px;
  }

  .info-card p {
    color: var(--text-light);
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .whatsapp-card {
    display: flex;
    gap: 14px;
    align-items: center;
    background: #25D366;
    color: white;
    padding: 20px 24px;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .whatsapp-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
  }

  .wa-icon {
    font-size: 2rem;
  }

  .whatsapp-card strong {
    font-size: 1.05rem;
    display: block;
  }

  .whatsapp-card p {
    font-size: 0.85rem;
    opacity: 0.9;
  }

  button[type="submit"] {
    width: 100%;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>

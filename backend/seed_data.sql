-- =====================================================
-- JNI Consultant - Seed Data
-- =====================================================
-- Paste this into Supabase SQL Editor and click Run
-- =====================================================

-- Clear existing data
DELETE FROM services;
DELETE FROM testimonials;
DELETE FROM articles;

-- =====================================================
-- 1. SERVICES (7 items)
-- =====================================================
INSERT INTO services (title, slug, short_description, full_description, icon_svg, display_order) VALUES
(
  'Izin PPIU & PIHK',
  'izin-ppiu-pihk',
  'Pengurusan izin Penyelenggara Perjalanan Ibadah Umrah dan Haji Khusus dengan proses cepat dan legal.',
  '<p>Layanan lengkap pengurusan izin PPIU (Penyelenggara Perjalanan Ibadah Umrah) dan PIHK (Penyelenggara Ibadah Haji Khusus) sesuai regulasi Kementerian Agama. Kami mendampingi dari awal hingga izin terbit.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14" /></svg>',
  1
),
(
  'Izin Kontraktor',
  'izin-kontraktor',
  'Pengurusan SBU, SIUJK, NIB Konstruksi, dan berbagai izin kontraktor sesuai standar LPJK.',
  '<p>Layanan profesional untuk pengurusan Sertifikat Badan Usaha (SBU), SIUJK, NIB Konstruksi, dan semua perizinan kontraktor yang diperlukan sesuai standar LPJK terbaru.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" /></svg>',
  2
),
(
  'Izin VISA',
  'izin-visa',
  'Layanan pengurusan visa untuk bisnis, wisata, kunjungan kerja, dan studi ke berbagai negara.',
  '<p>Pengurusan visa ke berbagai negara untuk keperluan bisnis, wisata, kunjungan kerja, dan studi. Kami menangani seluruh proses dari persiapan dokumen hingga pengambilan visa.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>',
  3
),
(
  'Akreditasi IATA',
  'akreditasi-iata',
  'Pendampingan lengkap untuk mendapatkan akreditasi IATA bagi agen perjalanan wisata.',
  '<p>Konsultasi dan pendampingan proses akreditasi IATA (International Air Transport Association) untuk meningkatkan kredibilitas dan kapabilitas agen perjalanan wisata Anda.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>',
  4
),
(
  'Bank Garansi',
  'bank-garansi',
  'Jaminan bank garansi untuk tender, jaminan pelaksanaan, uang muka, dan pemeliharaan proyek.',
  '<p>Layanan penerbitan Bank Garansi dan asuransi proyek meliputi jaminan tender, jaminan pelaksanaan, jaminan uang muka, dan jaminan pemeliharaan dengan syarat mudah dan proses transparan.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M7 8V6a5 5 0 0110 0v2" /></svg>',
  5
),
(
  'Laporan Keuangan',
  'laporan-keuangan',
  'Penyusunan laporan keuangan sesuai standar akuntansi untuk audit dan pelaporan pajak.',
  '<p>Jasa penyusunan laporan keuangan yang valid dan akuntabel oleh tenaga ahli berpengalaman, sesuai standar akuntansi untuk kebutuhan audit dan pelaporan pajak perusahaan Anda.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>',
  6
),
(
  'Perpajakan',
  'perpajakan',
  'Konsultasi pajak, pelaporan SPT, perhitungan PPh/PPN, dan pendampingan pemeriksaan pajak.',
  '<p>Layanan komprehensif perpajakan meliputi konsultasi pajak bulanan dan tahunan, pelaporan SPT, perhitungan PPh/PPN, serta pendampingan dalam pemeriksaan pajak.</p>',
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>',
  7
);

-- =====================================================
-- 2. TESTIMONIALS (4 items)
-- =====================================================
INSERT INTO testimonials (client_name, client_role, review_text, rating, photo_url) VALUES
(
  'Budi Santoso',
  'CEO, PT Maju Jaya',
  'JNI Consultant sangat profesional dalam mengurus izin PPIU kami. Prosesnya cepat dan transparan. Sangat direkomendasikan!',
  5,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
),
(
  'Siti Rahayu',
  'Direktur, CV Berkah Abadi',
  'Terima kasih JNI atas bantuannya dalam mengurus SBU konstruksi perusahaan kami. Tim sangat helpful dan responsif.',
  5,
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
),
(
  'Ahmad Wijaya',
  'Owner, PT Sukses Mandiri',
  'Pelayanan prima! Bank Garansi kami selesai tepat waktu. Akan menggunakan jasa JNI lagi untuk kebutuhan legalitas lainnya.',
  5,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
),
(
  'Dewi Kusuma',
  'Manager, PT Travel Nusantara',
  'Proses akreditasi IATA berjalan lancar berkat tim JNI. Sangat membantu dan selalu memberikan update terkini.',
  5,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
);

-- =====================================================
-- 3. SAMPLE ARTICLES (2 items)
-- =====================================================
INSERT INTO articles (slug, title, category, author, image_url, excerpt, content, read_time) VALUES
(
  'panduan-lengkap-izin-ppiu',
  'Panduan Lengkap Mengurus Izin PPIU untuk Travel Umrah',
  'Perizinan',
  'Admin JNI',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  'Pelajari langkah-langkah lengkap untuk mendapatkan izin PPIU dan memulai bisnis travel umrah yang legal.',
  '<h2>Apa itu Izin PPIU?</h2><p>Izin PPIU adalah izin resmi yang diberikan oleh Kementerian Agama kepada badan hukum yang ingin menyelenggarakan perjalanan ibadah umrah.</p><h2>Persyaratan</h2><ul><li>Badan hukum berbentuk PT</li><li>Modal disetor minimal Rp 5 Miliar</li><li>Memiliki kantor tetap</li><li>Memiliki tenaga profesional</li></ul>',
  '8 menit baca'
),
(
  'tips-memilih-bank-garansi',
  'Tips Memilih Bank Garansi yang Tepat untuk Proyek Anda',
  'Keuangan',
  'Admin JNI',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  'Panduan praktis memilih jenis bank garansi yang sesuai dengan kebutuhan proyek konstruksi Anda.',
  '<h2>Jenis-jenis Bank Garansi</h2><p>Bank garansi adalah jaminan yang diberikan oleh bank atas permintaan nasabah.</p><h3>1. Jaminan Tender</h3><p>Digunakan saat mengikuti tender proyek.</p><h3>2. Jaminan Pelaksanaan</h3><p>Diperlukan setelah memenangkan tender.</p>',
  '6 menit baca'
);

-- Done!
SELECT 'Seeded: ' || (SELECT COUNT(*) FROM services) || ' services, ' ||
       (SELECT COUNT(*) FROM testimonials) || ' testimonials, ' ||
       (SELECT COUNT(*) FROM articles) || ' articles' AS result;

-- =====================================================
-- JNI Consultant - Articles Database Schema
-- =====================================================
-- Run this script in your Hostinger MySQL database
-- (phpMyAdmin or MySQL command line)

-- Create the articles table
CREATE TABLE IF NOT EXISTS `articles` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `title` VARCHAR(500) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `author` VARCHAR(100) DEFAULT 'Admin',
    `image_url` VARCHAR(500) NOT NULL,
    `excerpt` TEXT,
    `content` TEXT NOT NULL,
    `read_time` VARCHAR(50) DEFAULT '5 menit baca',
    `related_slugs` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_published` TINYINT(1) DEFAULT 1,
    PRIMARY KEY (`id`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_category` (`category`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- Sample Data - Insert 2 Articles
-- =====================================================

INSERT INTO `articles` (`slug`, `title`, `category`, `author`, `image_url`, `excerpt`, `content`, `read_time`, `related_slugs`) VALUES
(
    'panduan-izin-ppiu-2024',
    'Panduan Lengkap Mengurus Izin PPIU 2024',
    'Perizinan',
    'Admin',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    'Pelajari langkah-langkah dan persyaratan terbaru untuk mendapatkan izin Penyelenggara Perjalanan Ibadah Umrah.',
    '<p>Penyelenggara Perjalanan Ibadah Umrah (PPIU) adalah badan usaha yang mendapat izin dari Kementerian Agama untuk menyelenggarakan perjalanan ibadah umrah. Artikel ini akan membahas langkah-langkah lengkap untuk mendapatkan izin PPIU di tahun 2024.</p>

<h2>Persyaratan Dasar PPIU</h2>
<p>Untuk mengajukan izin PPIU, perusahaan harus memenuhi beberapa persyaratan dasar berikut:</p>
<ul>
    <li>Berbentuk badan hukum PT (Perseroan Terbatas)</li>
    <li>Memiliki modal disetor minimal Rp 5 Miliar</li>
    <li>Memiliki kantor operasional yang layak</li>
    <li>Memiliki pimpinan yang beragama Islam</li>
    <li>Menyertakan bank garansi sebagai jaminan</li>
</ul>

<h2>Langkah-Langkah Pengurusan</h2>
<p>Proses pengurusan izin PPIU terdiri dari beberapa tahap:</p>
<ol>
    <li><strong>Persiapan Dokumen:</strong> Siapkan seluruh dokumen persyaratan termasuk akta pendirian, NPWP, dan izin lokasi.</li>
    <li><strong>Pendaftaran Online:</strong> Daftarkan melalui sistem SISKOPATUH Kemenag.</li>
    <li><strong>Verifikasi Lapangan:</strong> Tim Kemenag akan melakukan verifikasi ke kantor operasional.</li>
    <li><strong>Penerbitan SK:</strong> Jika lolos verifikasi, SK izin PPIU akan diterbitkan.</li>
</ol>

<h2>Biaya dan Waktu Pengurusan</h2>
<p>Estimasi waktu pengurusan PPIU adalah 3-6 bulan tergantung kelengkapan dokumen dan antrian verifikasi. Dengan bantuan konsultan berpengalaman seperti JNI, proses ini bisa dipercepat dan lebih efisien.</p>

<blockquote>
    <p>"Mengurus izin PPIU memerlukan ketelitian tinggi dalam penyiapan dokumen. Satu kesalahan kecil bisa menunda proses berbulan-bulan."</p>
</blockquote>

<h2>Kesimpulan</h2>
<p>Mendapatkan izin PPIU memerlukan persiapan yang matang dan pemahaman regulasi yang baik. Jika Anda membutuhkan bantuan profesional, tim JNI siap membantu Anda mengurus seluruh proses dari awal hingga terbit SK.</p>',
    '8 menit baca',
    'pentingnya-sbu-konstruksi,manfaat-akreditasi-iata'
),
(
    'pentingnya-sbu-konstruksi',
    'Pentingnya SBU untuk Perusahaan Konstruksi',
    'Konstruksi',
    'Admin',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    'Mengapa Sertifikat Badan Usaha menjadi kunci keberhasilan tender proyek konstruksi di Indonesia.',
    '<p>Sertifikat Badan Usaha (SBU) merupakan dokumen wajib bagi perusahaan konstruksi yang ingin berpartisipasi dalam proyek-proyek pemerintah maupun swasta skala besar di Indonesia.</p>

<h2>Apa itu SBU?</h2>
<p>SBU adalah sertifikat yang diterbitkan oleh LPJK (Lembaga Pengembangan Jasa Konstruksi) yang menyatakan bahwa suatu badan usaha telah memenuhi persyaratan untuk melaksanakan jasa konstruksi dalam bidang dan sub-bidang tertentu.</p>

<h2>Manfaat Memiliki SBU</h2>
<ul>
    <li>Dapat mengikuti tender proyek pemerintah</li>
    <li>Meningkatkan kredibilitas perusahaan</li>
    <li>Akses ke proyek-proyek bernilai besar</li>
    <li>Perlindungan hukum dalam pelaksanaan proyek</li>
</ul>

<h2>Klasifikasi SBU</h2>
<p>SBU dibagi berdasarkan kualifikasi yang menentukan nilai proyek yang bisa dikerjakan:</p>
<ol>
    <li><strong>Kecil (K1, K2, K3):</strong> Proyek hingga Rp 2,5 Miliar</li>
    <li><strong>Menengah (M1, M2):</strong> Proyek hingga Rp 50 Miliar</li>
    <li><strong>Besar (B1, B2):</strong> Proyek tanpa batas nilai</li>
</ol>

<p>Hubungi JNI Consultant untuk bantuan pengurusan SBU sesuai kebutuhan bisnis Anda.</p>',
    '6 menit baca',
    'panduan-izin-ppiu-2024,jenis-bank-garansi'
);


-- =====================================================
-- Useful Queries (for reference)
-- =====================================================

-- Get all published articles (for blog list)
-- SELECT id, slug, title, category, author, image_url, excerpt, read_time, created_at 
-- FROM articles 
-- WHERE is_published = 1 
-- ORDER BY created_at DESC;

-- Get single article by slug
-- SELECT * FROM articles WHERE slug = 'panduan-izin-ppiu-2024' AND is_published = 1;

-- Update article
-- UPDATE articles SET title = 'New Title', content = 'New content...' WHERE slug = 'article-slug';

-- Delete article (soft delete - set unpublished)
-- UPDATE articles SET is_published = 0 WHERE slug = 'article-slug';

-- Hard delete
-- DELETE FROM articles WHERE slug = 'article-slug';

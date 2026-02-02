-- =====================================================
-- JNI Consultant - Testimonials Schema
-- =====================================================
-- Run this script in phpMyAdmin after database.sql

CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `client_name` VARCHAR(100) NOT NULL,
    `client_role` VARCHAR(150) NOT NULL COMMENT 'e.g., CEO of PT Maju Jaya',
    `review_text` TEXT NOT NULL,
    `rating` TINYINT(1) NOT NULL DEFAULT 5 COMMENT '1 to 5 stars',
    `photo_url` VARCHAR(500) NULL COMMENT 'Path to uploaded photo',
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_active` (`is_active`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- Sample Testimonials Data
-- =====================================================
INSERT INTO `testimonials` (`client_name`, `client_role`, `review_text`, `rating`, `photo_url`) VALUES
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
);

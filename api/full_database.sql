-- =====================================================
-- JNI Consultant - Full Database Schema
-- =====================================================
-- Import this file to your Hostinger MySQL Database
-- =====================================================

-- 1. Users Table (Admin)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` ENUM('admin', 'editor') DEFAULT 'editor',
    `is_active` TINYINT(1) DEFAULT 1,
    `last_login` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin User (Password: admin123)
-- You should change this immediately after login!
INSERT INTO `users` (`username`, `password`, `email`, `role`, `is_active`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'admin', 1);


-- 2. Articles Table (with SEO columns)
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
    `meta_title` VARCHAR(70) NULL,
    `meta_description` VARCHAR(160) NULL,
    `focus_keyword` VARCHAR(100) NULL,
    `seo_score` INT(3) DEFAULT 0,
    `related_slugs` VARCHAR(500),
    `is_published` TINYINT(1) DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_category` (`category`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_seo_score` (`seo_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. Visitor Logs (Analytics)
CREATE TABLE IF NOT EXISTS `visitor_logs` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `page_url` VARCHAR(500) NOT NULL,
    `page_title` VARCHAR(255) NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(500) NULL,
    `referrer` VARCHAR(500) NULL,
    `country` VARCHAR(100) NULL,
    `device_type` ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
    `browser` VARCHAR(100) NULL,
    `session_id` VARCHAR(100) NULL,
    `access_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_page_url` (`page_url`(255)),
    INDEX `idx_access_time` (`access_time`),
    INDEX `idx_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Activity Log (Admin Audit)
CREATE TABLE IF NOT EXISTS `activity_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NULL,
    `username` VARCHAR(50) NULL,
    `action` VARCHAR(50) NOT NULL,
    `target_type` VARCHAR(50) NULL,
    `target_id` INT(11) NULL,
    `target_title` VARCHAR(255) NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Testimonials Table
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


-- 6. Gallery Table
CREATE TABLE IF NOT EXISTS `gallery` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `category` VARCHAR(100) DEFAULT 'General',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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


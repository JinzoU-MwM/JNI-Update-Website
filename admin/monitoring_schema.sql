-- =====================================================
-- JNI Consultant - Advanced Monitoring Schema
-- =====================================================
-- Run this script in phpMyAdmin AFTER admin_schema.sql

-- =====================================================
-- MODULE 1: Visitor Tracking Table
-- =====================================================
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


-- =====================================================
-- MODULE 2: SEO Columns for Articles Table
-- =====================================================
-- Add SEO-related columns to existing articles table

ALTER TABLE `articles`
    ADD COLUMN `meta_title` VARCHAR(70) NULL AFTER `title`,
    ADD COLUMN `meta_description` VARCHAR(160) NULL AFTER `meta_title`,
    ADD COLUMN `focus_keyword` VARCHAR(100) NULL AFTER `meta_description`,
    ADD COLUMN `seo_score` INT(3) DEFAULT 0 AFTER `focus_keyword`;


-- =====================================================
-- Index for SEO Analysis
-- =====================================================
ALTER TABLE `articles` ADD INDEX `idx_seo_score` (`seo_score`);


-- =====================================================
-- Sample Data for Testing Analytics
-- =====================================================
INSERT INTO `visitor_logs` (`page_url`, `page_title`, `ip_address`, `user_agent`, `referrer`, `device_type`, `browser`, `access_time`) VALUES
('/', 'Beranda', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://google.com', 'desktop', 'Chrome', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('/blog.html', 'Artikel', '192.168.1.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)', 'https://google.com', 'mobile', 'Safari', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('/article.html?id=panduan-izin-ppiu-2024', 'Panduan PPIU', '192.168.1.3', 'Mozilla/5.0 (Windows NT 10.0)', NULL, 'desktop', 'Firefox', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('/services.html', 'Layanan', '192.168.1.4', 'Mozilla/5.0 (Linux; Android 10)', 'https://instagram.com', 'mobile', 'Chrome', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('/', 'Beranda', '192.168.1.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', 'https://facebook.com', 'desktop', 'Safari', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('/contact.html', 'Kontak', '192.168.1.6', 'Mozilla/5.0 (Windows NT 10.0)', NULL, 'desktop', 'Edge', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('/blog.html', 'Artikel', '192.168.1.7', 'Mozilla/5.0 (iPad)', 'https://twitter.com', 'tablet', 'Safari', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('/', 'Beranda', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0)', 'https://google.com', 'desktop', 'Chrome', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('/article.html?id=pentingnya-sbu-konstruksi', 'SBU Konstruksi', '192.168.1.9', 'Mozilla/5.0 (Linux)', NULL, 'desktop', 'Chrome', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('/', 'Beranda', '192.168.1.10', 'Mozilla/5.0 (iPhone)', 'https://linkedin.com', 'mobile', 'Safari', DATE_SUB(NOW(), INTERVAL 7 DAY));

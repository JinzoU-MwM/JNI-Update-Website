-- =====================================================
-- JNI Consultant - Messages Table Schema
-- =====================================================
-- Stores incoming messages from Contact Form
-- =====================================================

CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `service_type` VARCHAR(100) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `source` ENUM('contact_form', 'bubble_chat') DEFAULT 'contact_form',
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

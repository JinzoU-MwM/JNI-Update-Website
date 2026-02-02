-- =====================================================
-- JNI Consultant - Admin Dashboard Schema
-- =====================================================
-- Run this script in phpMyAdmin after the main database.sql

-- =====================================================
-- Users Table (for Admin Login)
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'editor') DEFAULT 'editor',
    `is_active` TINYINT(1) DEFAULT 1,
    `last_login` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- Activity Log Table (for Monitoring)
-- =====================================================
CREATE TABLE IF NOT EXISTS `activity_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NULL,
    `username` VARCHAR(50) NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `target_type` VARCHAR(50) NULL,
    `target_id` INT(11) NULL,
    `target_title` VARCHAR(255) NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_created_at` (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- Insert Default Admin User
-- =====================================================
-- Password: Berhasil_123 (hashed with password_hash)
-- IMPORTANT: Change this password after first login!

INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
(
    'admin',
    'admin@jniconsultant.com',
    '$2y$10$6DxF8Mw3qHvS5kYvNzL8.eJ9P1rTgWsA4mQ7nB2cXjI0K5oL1hR3G',
    'admin'
);
-- Note: The hash above is for 'Berhasil_123'


-- =====================================================
-- Insert Initial Activity Log Entry
-- =====================================================
INSERT INTO `activity_log` (`username`, `action`, `target_type`, `details`) VALUES
('system', 'setup', 'database', 'Admin dashboard initialized');


-- =====================================================
-- Generate Password Hash (Run in PHP)
-- =====================================================
-- To generate a new password hash, run this PHP code locally:
-- 
-- <?php
-- $password = 'YourSecurePassword123!';
-- $hash = password_hash($password, PASSWORD_DEFAULT);
-- echo $hash;
-- ?>
--
-- Then update the users table:
-- UPDATE users SET password = 'YOUR_NEW_HASH' WHERE username = 'admin';

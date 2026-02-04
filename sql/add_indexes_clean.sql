-- Articles indexes
ALTER TABLE `articles` ADD INDEX `idx_slug` (`slug`);

ALTER TABLE `articles` ADD INDEX `idx_published_created` (`is_published`, `created_at`);

ALTER TABLE `articles` ADD INDEX `idx_category` (`category`);

-- Services indexes  
ALTER TABLE `services` ADD INDEX `idx_slug` (`slug`);

ALTER TABLE `services` ADD INDEX `idx_active_order` (`is_active`, `display_order`);

-- Gallery indexes
ALTER TABLE `gallery` ADD INDEX `idx_created` (`created_at`);

-- Testimonials indexes
ALTER TABLE `testimonials` ADD INDEX `idx_active_created` (`is_active`, `created_at`);

-- Messages indexes
ALTER TABLE `messages` ADD INDEX `idx_created` (`created_at`);

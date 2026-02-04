<?php
/**
 * Security Helper Functions
 * Centralized security utilities for input validation, CSRF protection, and XSS prevention
 */

// ==========================================
// CSRF TOKEN MANAGEMENT
// ==========================================

/**
 * Generate CSRF token and store in session
 */
function generateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token from request
 */
function validateCSRFToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Output CSRF token as hidden form field
 */
function csrfField() {
    $token = generateCSRFToken();
    echo '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

// ==========================================
// INPUT VALIDATION & SANITIZATION
// ==========================================

/**
 * Sanitize string input
 */
function sanitizeString($input, $maxLength = 255) {
    $input = trim($input);
    $input = strip_tags($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return substr($input, 0, $maxLength);
}

/**
 * Sanitize slug (URL-safe string)
 */
function sanitizeSlug($input) {
    $input = strtolower(trim($input));
    $input = preg_replace('/[^a-z0-9\-]/', '', $input);
    return substr($input, 0, 100);
}

/**
 * Sanitize email
 */
function sanitizeEmail($email) {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Sanitize integer
 */
function sanitizeInt($input) {
    return filter_var($input, FILTER_VALIDATE_INT) !== false ? (int)$input : 0;
}

/**
 * Validate URL
 */
function validateURL($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

// ==========================================
// XSS PROTECTION
// ==========================================

/**
 * Safe output - prevent XSS
 */
function safeEcho($string) {
    echo htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

/**
 * Safe HTML output (for rich content)
 * Only allows safe HTML tags
 */
function safeHTML($html) {
    $allowed_tags = '<p><br><strong><em><u><a><ul><ol><li><h1><h2><h3><h4><blockquote><img>';
    return strip_tags($html, $allowed_tags);
}

// ==========================================
// RATE LIMITING
// ==========================================

/**
 * Simple rate limiting using session
 * @param string $action Unique identifier for the action
 * @param int $maxAttempts Maximum allowed attempts
 * @param int $timeWindow Time window in seconds
 * @return bool True if action is allowed, false if rate limited
 */
function checkRateLimit($action, $maxAttempts = 5, $timeWindow = 300) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $key = 'rate_limit_' . $action;
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = [];
    }
    
    // Remove old attempts outside time window
    $_SESSION[$key] = array_filter($_SESSION[$key], function($timestamp) use ($now, $timeWindow) {
        return ($now - $timestamp) < $timeWindow;
    });
    
    // Check if limit exceeded
    if (count($_SESSION[$key]) >= $maxAttempts) {
        return false;
    }
    
    // Record this attempt
    $_SESSION[$key][] = $now;
    return true;
}

// ==========================================
// FILE UPLOAD VALIDATION
// ==========================================

/**
 * Validate uploaded file
 */
function validateFileUpload($file, $allowedTypes = [], $maxSize = 5242880) {
    $errors = [];
    
    // Check if file was uploaded
    if (!isset($file['error']) || is_array($file['error'])) {
        $errors[] = 'Invalid file upload';
        return ['valid' => false, 'errors' => $errors];
    }
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Upload error: ' . $file['error'];
        return ['valid' => false, 'errors' => $errors];
    }
    
    // Check file size
    if ($file['size'] > $maxSize) {
        $errors[] = 'File too large. Maximum size: ' . ($maxSize / 1024 / 1024) . 'MB';
        return ['valid' => false, 'errors' => $errors];
    }
    
    // Check file type
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    
    if (!empty($allowedTypes) && !in_array($mimeType, $allowedTypes)) {
        $errors[] = 'Invalid file type. Allowed types: ' . implode(', ', $allowedTypes);
        return ['valid' => false, 'errors' => $errors];
    }
    
    return ['valid' => true, 'mime_type' => $mimeType];
}

// ==========================================
// PAGE WHITELIST (for admin dashboard)
// ==========================================

/**
 * Check if page is in whitelist
 */
function isValidPage($page, $allowedPages = []) {
    return in_array($page, $allowedPages, true);
}

/**
 * Get default allowed admin pages
 */
function getAllowedAdminPages() {
    return [
        'dashboard',
        'list',
        'create',
        'edit',
        'gallery',
        'testimonials',
        'services',
        'create_service',
        'edit_service',
        'messages',
        'users',
        'clients'
    ];
}

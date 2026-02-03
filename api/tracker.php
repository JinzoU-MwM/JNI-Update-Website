<?php
/**
 * Visitor Tracking Script
 * Include this file in your public pages (index.php, etc.)
 */
require_once __DIR__ . '/config.php';

// Avoid tracking admin pages or API calls if accidentally included
if (strpos($_SERVER['REQUEST_URI'], '/admin/') !== false || strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
    return;
}

try {
    $pdo = getDbConnection();
    
    // Get visitor data
    $ip = $_SERVER['REMOTE_ADDR'];
    $url = $_SERVER['REQUEST_URI'];
    // Clean URL query params for better aggregation
    $urlPath = parse_url($url, PHP_URL_PATH);
    
    $referrer = $_SERVER['HTTP_REFERER'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Simple device detection
    $deviceType = 'desktop';
    if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', $userAgent)) {
        $deviceType = 'tablet';
    } elseif (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', $userAgent)) {
        $deviceType = 'mobile';
    }
    
    // Simple browser detection
    $browser = 'Other';
    if (strpos($userAgent, 'Firefox') !== false) $browser = 'Firefox';
    elseif (strpos($userAgent, 'Chrome') !== false) $browser = 'Chrome';
    elseif (strpos($userAgent, 'Safari') !== false) $browser = 'Safari';
    elseif (strpos($userAgent, 'Edge') !== false) $browser = 'Edge';
    elseif (strpos($userAgent, 'MSIE') !== false || strpos($userAgent, 'Trident') !== false) $browser = 'IE';
    
    // Page Title (attempt to get from output buffer or define manually)
    // For now, simpler to just rely on URL or let the page define $pageTitle
    $title = $pageTitle ?? $urlPath;
    
    // Insert log
    $stmt = $pdo->prepare("INSERT INTO visitor_logs (ip_address, page_url, page_title, referrer, user_agent, device_type, browser, access_time) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$ip, $urlPath, $title, $referrer, $userAgent, $deviceType, $browser]);
    
} catch (Exception $e) {
    // Silent fail to not break the site
}
?>

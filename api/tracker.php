<?php
/**
 * =====================================================
 * JNI Consultant - Visitor Tracker API
 * =====================================================
 * 
 * Lightweight tracker for logging page visits
 * Place tracking code in public pages
 * 
 * Endpoint: POST /api/tracker.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Include database configuration
require_once __DIR__ . '/config.php';

/**
 * Get real IP address (handles proxies)
 */
function getRealIpAddress() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    } else {
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}

/**
 * Detect device type from user agent
 */
function detectDevice($userAgent) {
    $userAgent = strtolower($userAgent);
    
    if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i', $userAgent)) {
        return 'tablet';
    }
    if (preg_match('/(mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile)/i', $userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

/**
 * Detect browser from user agent
 */
function detectBrowser($userAgent) {
    if (strpos($userAgent, 'Edg') !== false) return 'Edge';
    if (strpos($userAgent, 'Chrome') !== false) return 'Chrome';
    if (strpos($userAgent, 'Safari') !== false) return 'Safari';
    if (strpos($userAgent, 'Firefox') !== false) return 'Firefox';
    if (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) return 'Opera';
    if (strpos($userAgent, 'MSIE') !== false || strpos($userAgent, 'Trident') !== false) return 'IE';
    return 'Other';
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Fallback to POST data
if (empty($input)) {
    $input = $_POST;
}

// Get page data
$pageUrl = $input['url'] ?? $input['page_url'] ?? '';
$pageTitle = $input['title'] ?? $input['page_title'] ?? '';
$referrer = $input['referrer'] ?? $_SERVER['HTTP_REFERER'] ?? '';

// Validate URL
if (empty($pageUrl)) {
    echo json_encode(['success' => false, 'error' => 'URL is required']);
    exit;
}

// Get visitor info
$ipAddress = getRealIpAddress();
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$deviceType = detectDevice($userAgent);
$browser = detectBrowser($userAgent);
$sessionId = session_id() ?: md5($ipAddress . date('Y-m-d'));

// Sanitize inputs
$pageUrl = filter_var($pageUrl, FILTER_SANITIZE_URL);
$pageTitle = htmlspecialchars(substr($pageTitle, 0, 255), ENT_QUOTES, 'UTF-8');
$referrer = filter_var($referrer, FILTER_SANITIZE_URL);

try {
    $pdo = getDbConnection();
    
    // Rate limiting: Check if same IP visited same page in last 30 seconds
    $checkSql = "SELECT COUNT(*) FROM visitor_logs 
                 WHERE ip_address = :ip AND page_url = :url 
                 AND access_time > DATE_SUB(NOW(), INTERVAL 30 SECOND)";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([':ip' => $ipAddress, ':url' => $pageUrl]);
    
    if ($checkStmt->fetchColumn() > 0) {
        // Skip duplicate within 30 seconds
        echo json_encode(['success' => true, 'message' => 'Skipped duplicate']);
        exit;
    }
    
    // Insert visitor log
    $sql = "INSERT INTO visitor_logs 
            (page_url, page_title, ip_address, user_agent, referrer, device_type, browser, session_id) 
            VALUES 
            (:url, :title, :ip, :ua, :ref, :device, :browser, :session)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':url' => $pageUrl,
        ':title' => $pageTitle,
        ':ip' => $ipAddress,
        ':ua' => substr($userAgent, 0, 500),
        ':ref' => substr($referrer, 0, 500),
        ':device' => $deviceType,
        ':browser' => $browser,
        ':session' => $sessionId
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Tracked']);
    
} catch (PDOException $e) {
    error_log("Tracker Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>

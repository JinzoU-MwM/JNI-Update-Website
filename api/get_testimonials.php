<?php
/**
 * =====================================================
 * Jamnasindo - Public Testimonials API
 * =====================================================
 * 
 * Returns active testimonials for the public website
 * No authentication required
 * 
 * Usage: api/get_testimonials.php
 * Optional: ?limit=6 (default: 6)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/config.php';

try {
    $pdo = getDbConnection();
    
    // Get limit parameter (default 6, max 12)
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 6;
    $limit = max(1, min($limit, 12));
    
    // Fetch active testimonials
    $stmt = $pdo->prepare("
        SELECT id, client_name, client_role, review_text, rating, photo_url, created_at 
        FROM testimonials 
        WHERE is_active = 1 
        ORDER BY created_at DESC 
        LIMIT ?
    ");
    $stmt->execute([$limit]);
    $testimonials = $stmt->fetchAll();
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'count' => count($testimonials),
        'data' => $testimonials
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load testimonials.'
    ]);
}
?>

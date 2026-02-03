<?php
/**
 * =====================================================
 * Jamnasindo - Sitemap Generator
 * =====================================================
 * 
 * Generates sitemap.xml from published articles
 * Writes to root directory
 * 
 * Usage: GET /api/generate_sitemap.php
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

// Include database configuration
require_once __DIR__ . '/config.php';

// Require authentication
if (!isset($_SESSION['admin']) || $_SESSION['admin']['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized. Please login.']);
    exit;
}

// Base URL - Change this to your domain
$baseUrl = 'https://jniconsultant.com';

// Static pages to include
$staticPages = [
    ['url' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['url' => '/index.html', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['url' => '/services.html', 'priority' => '0.9', 'changefreq' => 'monthly'],
    ['url' => '/about.html', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['url' => '/blog.html', 'priority' => '0.9', 'changefreq' => 'daily'],
    ['url' => '/gallery.html', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['url' => '/contact.html', 'priority' => '0.8', 'changefreq' => 'monthly'],
];

try {
    $pdo = getDbConnection();
    
    // Get all published articles
    $stmt = $pdo->query("SELECT slug, updated_at, created_at FROM articles WHERE is_published = 1 ORDER BY created_at DESC");
    $articles = $stmt->fetchAll();
    
    // Start XML
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    
    // Add static pages
    foreach ($staticPages as $page) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>{$baseUrl}{$page['url']}</loc>\n";
        $xml .= "    <changefreq>{$page['changefreq']}</changefreq>\n";
        $xml .= "    <priority>{$page['priority']}</priority>\n";
        $xml .= "  </url>\n";
    }
    
    // Add article pages
    foreach ($articles as $article) {
        $lastMod = $article['updated_at'] ?? $article['created_at'];
        $lastModDate = date('Y-m-d', strtotime($lastMod));
        
        $xml .= "  <url>\n";
        $xml .= "    <loc>{$baseUrl}/article.html?id={$article['slug']}</loc>\n";
        $xml .= "    <lastmod>{$lastModDate}</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.8</priority>\n";
        $xml .= "  </url>\n";
    }
    
    $xml .= '</urlset>';
    
    // Write to root directory
    $sitemapPath = __DIR__ . '/../sitemap.xml';
    $written = file_put_contents($sitemapPath, $xml);
    
    if ($written !== false) {
        // Log activity
        $logSql = "INSERT INTO activity_log (user_id, username, action, target_type, details, ip_address) 
                   VALUES (:uid, :uname, 'generate', 'sitemap', :details, :ip)";
        $logStmt = $pdo->prepare($logSql);
        $logStmt->execute([
            ':uid' => $_SESSION['admin']['id'],
            ':uname' => $_SESSION['admin']['username'],
            ':details' => 'Generated sitemap.xml with ' . (count($staticPages) + count($articles)) . ' URLs',
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Sitemap generated successfully',
            'path' => '/sitemap.xml',
            'urls_count' => count($staticPages) + count($articles),
            'articles_count' => count($articles)
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to write sitemap file']);
    }
    
} catch (PDOException $e) {
    error_log("Sitemap Generator Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
} catch (Exception $e) {
    error_log("Sitemap Generator Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

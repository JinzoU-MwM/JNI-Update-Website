<?php
/**
 * =====================================================
 * JNI Consultant - Articles API
 * =====================================================
 * 
 * Endpoints:
 *   GET /api/get_articles.php          - Get all articles (list)
 *   GET /api/get_articles.php?slug=xxx - Get single article by slug
 * 
 * Security: Uses PDO prepared statements to prevent SQL injection
 */

// Set JSON response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');  // Allow CORS for development
header('Access-Control-Allow-Methods: GET');
header('X-Content-Type-Options: nosniff');

// Include database configuration
require_once __DIR__ . '/config.php';

/**
 * Get all published articles (for blog listing page)
 * Returns: id, slug, title, category, author, image_url, excerpt, read_time, created_at
 */
function getAllArticles($pdo) {
    $sql = "SELECT 
                id, 
                slug, 
                title, 
                category, 
                author,
                image_url, 
                excerpt,
                read_time,
                DATE_FORMAT(created_at, '%d %b %Y') as formatted_date,
                created_at
            FROM articles 
            WHERE is_published = 1 
            ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get single article by slug (for article detail page)
 * Returns: All article fields including full content
 */
function getArticleBySlug($pdo, $slug) {
    $sql = "SELECT 
                id,
                slug,
                title,
                category,
                author,
                image_url,
                excerpt,
                content,
                read_time,
                related_slugs,
                DATE_FORMAT(created_at, '%d %b %Y') as formatted_date,
                DATE_FORMAT(created_at, '%Y-%m-%d') as iso_date,
                created_at,
                updated_at
            FROM articles 
            WHERE slug = :slug AND is_published = 1
            LIMIT 1";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmt->execute();
    
    $article = $stmt->fetch();
    
    // Parse related_slugs into array
    if ($article && !empty($article['related_slugs'])) {
        $article['related'] = array_map('trim', explode(',', $article['related_slugs']));
    } else if ($article) {
        $article['related'] = [];
    }
    
    return $article;
}

/**
 * Get related articles by slugs
 */
function getRelatedArticles($pdo, $slugsArray) {
    if (empty($slugsArray)) {
        return [];
    }
    
    // Create placeholders for IN clause
    $placeholders = implode(',', array_fill(0, count($slugsArray), '?'));
    
    $sql = "SELECT 
                id, slug, title, category, image_url, 
                DATE_FORMAT(created_at, '%d %b %Y') as formatted_date
            FROM articles 
            WHERE slug IN ($placeholders) AND is_published = 1";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($slugsArray);
    
    return $stmt->fetchAll();
}


// =====================================================
// Main API Logic
// =====================================================

try {
    $pdo = getDbConnection();
    
    // Check if requesting single article by slug
    if (isset($_GET['slug']) && !empty($_GET['slug'])) {
        // Sanitize slug input
        $slug = preg_replace('/[^a-zA-Z0-9\-]/', '', $_GET['slug']);
        
        $article = getArticleBySlug($pdo, $slug);
        
        if ($article) {
            // Get related articles if available
            if (!empty($article['related'])) {
                $article['relatedArticles'] = getRelatedArticles($pdo, $article['related']);
            }
            
            echo json_encode([
                'success' => true,
                'data' => $article
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Article not found'
            ]);
        }
        
    } else {
        // Return all articles (blog listing)
        $articles = getAllArticles($pdo);
        
        echo json_encode([
            'success' => true,
            'count' => count($articles),
            'data' => $articles
        ]);
    }
    
} catch (PDOException $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error occurred'
    ]);
}
?>

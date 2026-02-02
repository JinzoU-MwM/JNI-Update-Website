<?php
/**
 * =====================================================
 * JNI Consultant - Admin API
 * =====================================================
 * 
 * Protected API for admin operations
 * Requires valid session to access
 * 
 * Actions:
 *   GET  ?action=dashboard      - Get dashboard stats
 *   GET  ?action=list_articles  - Get all articles
 *   GET  ?action=get_article&id - Get single article
 *   GET  ?action=activity_log   - Get activity logs
 *   POST action=create          - Create new article
 *   POST action=update          - Update article
 *   POST action=delete          - Delete article
 */

session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Include database configuration
require_once __DIR__ . '/../api/config.php';

// =====================================================
// Authentication Check
// =====================================================
function requireAuth() {
    if (!isset($_SESSION['admin']) || $_SESSION['admin']['logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized. Please login.']);
        exit;
    }
}

// Check authentication for all requests
requireAuth();

// =====================================================
// Activity Logging
// =====================================================
function logActivity($pdo, $action, $targetType = null, $targetId = null, $targetTitle = null, $details = null) {
    $userId = $_SESSION['admin']['id'] ?? null;
    $username = $_SESSION['admin']['username'] ?? 'unknown';
    
    $sql = "INSERT INTO activity_log (user_id, username, action, target_type, target_id, target_title, details, ip_address) 
            VALUES (:user_id, :username, :action, :target_type, :target_id, :target_title, :details, :ip)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_id' => $userId,
        ':username' => $username,
        ':action' => $action,
        ':target_type' => $targetType,
        ':target_id' => $targetId,
        ':target_title' => $targetTitle,
        ':details' => $details,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ]);
}

// =====================================================
// GET Handlers
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    try {
        $pdo = getDbConnection();
        
        switch ($action) {
            case 'dashboard':
                // Get dashboard statistics
                $stats = [];
                
                // Total articles
                $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles");
                $stats['total_articles'] = $stmt->fetch()['total'];
                
                // Published articles
                $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE is_published = 1");
                $stats['published_articles'] = $stmt->fetch()['total'];
                
                // Categories count
                $stmt = $pdo->query("SELECT COUNT(DISTINCT category) as total FROM articles");
                $stats['categories'] = $stmt->fetch()['total'];
                
                // Today's activities
                $stmt = $pdo->query("SELECT COUNT(*) as total FROM activity_log WHERE DATE(created_at) = CURDATE()");
                $stats['today_activities'] = $stmt->fetch()['total'];
                
                // Recent activity (last 5)
                $stmt = $pdo->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 5");
                $stats['recent_activity'] = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'data' => $stats]);
                break;
                
            case 'list_articles':
                $sql = "SELECT id, slug, title, category, author, image_url, excerpt, is_published, 
                        meta_title, meta_description, focus_keyword, seo_score,
                        DATE_FORMAT(created_at, '%d %b %Y') as formatted_date, created_at 
                        FROM articles ORDER BY created_at DESC";
                $stmt = $pdo->query($sql);
                $articles = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'data' => $articles]);
                break;
                
            case 'get_article':
                $id = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
                if (!$id) {
                    echo json_encode(['success' => false, 'error' => 'Invalid article ID']);
                    break;
                }
                
                $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $article = $stmt->fetch();
                
                if ($article) {
                    echo json_encode(['success' => true, 'data' => $article]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Article not found']);
                }
                break;
                
            case 'activity_log':
                $stmt = $pdo->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100");
                $logs = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'data' => $logs]);
                break;
                
            default:
                echo json_encode(['success' => false, 'error' => 'Unknown action']);
        }
        
    } catch (PDOException $e) {
        error_log("Admin API Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
    
    exit;
}

// =====================================================
// POST Handlers
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    try {
        $pdo = getDbConnection();
        
        switch ($action) {
            case 'create':
                // Validate required fields
                $required = ['title', 'slug', 'category', 'image_url', 'content'];
                foreach ($required as $field) {
                    if (empty($_POST[$field])) {
                        echo json_encode(['success' => false, 'error' => "Field '$field' is required"]);
                        exit;
                    }
                }
                
                // Sanitize input
                $title = trim($_POST['title']);
                $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim($_POST['slug'])));
                $category = trim($_POST['category']);
                $imageUrl = filter_var($_POST['image_url'], FILTER_SANITIZE_URL);
                $excerpt = trim($_POST['excerpt'] ?? '');
                $content = $_POST['content']; // Allow HTML
                $readTime = trim($_POST['read_time'] ?? '5 menit baca');
                $author = $_SESSION['admin']['username'];
                
                // SEO fields
                $metaTitle = trim($_POST['meta_title'] ?? '');
                $metaDescription = trim($_POST['meta_description'] ?? '');
                $focusKeyword = trim($_POST['focus_keyword'] ?? '');
                $seoScore = intval($_POST['seo_score'] ?? 0);
                
                // Check if slug exists
                $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE slug = :slug");
                $checkStmt->execute([':slug' => $slug]);
                if ($checkStmt->fetch()) {
                    echo json_encode(['success' => false, 'error' => 'Slug already exists']);
                    exit;
                }
                
                // Insert article
                $sql = "INSERT INTO articles (slug, title, category, author, image_url, excerpt, content, read_time, 
                        meta_title, meta_description, focus_keyword, seo_score, is_published) 
                        VALUES (:slug, :title, :category, :author, :image_url, :excerpt, :content, :read_time,
                        :meta_title, :meta_description, :focus_keyword, :seo_score, 1)";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':slug' => $slug,
                    ':title' => $title,
                    ':category' => $category,
                    ':author' => $author,
                    ':image_url' => $imageUrl,
                    ':excerpt' => $excerpt,
                    ':content' => $content,
                    ':read_time' => $readTime,
                    ':meta_title' => $metaTitle,
                    ':meta_description' => $metaDescription,
                    ':focus_keyword' => $focusKeyword,
                    ':seo_score' => $seoScore
                ]);
                
                $newId = $pdo->lastInsertId();
                
                // Log activity
                logActivity($pdo, 'create', 'article', $newId, $title, "Created new article: $title");
                
                echo json_encode(['success' => true, 'message' => 'Article created', 'id' => $newId]);
                break;
                
            case 'update':
                $id = filter_var($_POST['id'] ?? 0, FILTER_VALIDATE_INT);
                if (!$id) {
                    echo json_encode(['success' => false, 'error' => 'Invalid article ID']);
                    exit;
                }
                
                // Sanitize input
                $title = trim($_POST['title']);
                $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim($_POST['slug'])));
                $category = trim($_POST['category']);
                $imageUrl = filter_var($_POST['image_url'], FILTER_SANITIZE_URL);
                $excerpt = trim($_POST['excerpt'] ?? '');
                $content = $_POST['content'];
                $readTime = trim($_POST['read_time'] ?? '5 menit baca');
                
                // SEO fields
                $metaTitle = trim($_POST['meta_title'] ?? '');
                $metaDescription = trim($_POST['meta_description'] ?? '');
                $focusKeyword = trim($_POST['focus_keyword'] ?? '');
                $seoScore = intval($_POST['seo_score'] ?? 0);
                
                // Check if slug exists for other articles
                $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE slug = :slug AND id != :id");
                $checkStmt->execute([':slug' => $slug, ':id' => $id]);
                if ($checkStmt->fetch()) {
                    echo json_encode(['success' => false, 'error' => 'Slug already used by another article']);
                    exit;
                }
                
                // Update article
                $sql = "UPDATE articles SET 
                        title = :title,
                        slug = :slug,
                        category = :category,
                        image_url = :image_url,
                        excerpt = :excerpt,
                        content = :content,
                        read_time = :read_time,
                        meta_title = :meta_title,
                        meta_description = :meta_description,
                        focus_keyword = :focus_keyword,
                        seo_score = :seo_score,
                        updated_at = NOW()
                        WHERE id = :id";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':title' => $title,
                    ':slug' => $slug,
                    ':category' => $category,
                    ':image_url' => $imageUrl,
                    ':excerpt' => $excerpt,
                    ':content' => $content,
                    ':read_time' => $readTime,
                    ':meta_title' => $metaTitle,
                    ':meta_description' => $metaDescription,
                    ':focus_keyword' => $focusKeyword,
                    ':seo_score' => $seoScore,
                    ':id' => $id
                ]);
                
                // Log activity
                logActivity($pdo, 'update', 'article', $id, $title, "Updated article: $title");
                
                echo json_encode(['success' => true, 'message' => 'Article updated']);
                break;
                
            case 'delete':
                $id = filter_var($_POST['id'] ?? 0, FILTER_VALIDATE_INT);
                if (!$id) {
                    echo json_encode(['success' => false, 'error' => 'Invalid article ID']);
                    exit;
                }
                
                // Get article title for logging
                $getStmt = $pdo->prepare("SELECT title FROM articles WHERE id = :id");
                $getStmt->execute([':id' => $id]);
                $article = $getStmt->fetch();
                $articleTitle = $article ? $article['title'] : 'Unknown';
                
                // Delete article
                $stmt = $pdo->prepare("DELETE FROM articles WHERE id = :id");
                $stmt->execute([':id' => $id]);
                
                if ($stmt->rowCount() > 0) {
                    // Log activity
                    logActivity($pdo, 'delete', 'article', $id, $articleTitle, "Deleted article: $articleTitle");
                    
                    echo json_encode(['success' => true, 'message' => 'Article deleted']);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Article not found']);
                }
                break;
                
            default:
                echo json_encode(['success' => false, 'error' => 'Unknown action']);
        }
        
    } catch (PDOException $e) {
        error_log("Admin API Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    
    exit;
}

// Invalid method
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>

<?php
/**
 * =====================================================
 * JNI Consultant - Admin Testimonials API
 * =====================================================
 * 
 * Protected API for testimonial management
 * Requires valid session to access
 * 
 * Actions:
 *   GET  ?action=list         - Get all testimonials
 *   POST action=create        - Create new testimonial
 *   POST action=delete        - Delete testimonial
 *   POST action=toggle_active - Toggle active status
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
// Activity Logging (shares same log table)
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
// Helper: Upload Image
// =====================================================
function uploadPhoto($file) {
    $uploadDir = __DIR__ . '/../uploads/testimonials/';
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Validate file
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        return ['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed.'];
    }
    
    $maxSize = 2 * 1024 * 1024; // 2MB
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'error' => 'File too large. Max 2MB.'];
    }
    
    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'testimonial_' . time() . '_' . uniqid() . '.' . $ext;
    $targetPath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['success' => true, 'path' => 'uploads/testimonials/' . $filename];
    }
    
    return ['success' => false, 'error' => 'Failed to upload file.'];
}

// =====================================================
// GET Handlers
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    try {
        $pdo = getDbConnection();
        
        switch ($action) {
            case 'list':
                $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC");
                $testimonials = $stmt->fetchAll();
                echo json_encode(['success' => true, 'data' => $testimonials]);
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
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
                $clientName = trim($_POST['client_name'] ?? '');
                $clientRole = trim($_POST['client_role'] ?? '');
                $reviewText = trim($_POST['review_text'] ?? '');
                $rating = intval($_POST['rating'] ?? 5);
                
                if (empty($clientName) || empty($reviewText)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Client name and review text are required.']);
                    exit;
                }
                
                // Validate rating
                if ($rating < 1 || $rating > 5) {
                    $rating = 5;
                }
                
                // Handle photo upload (optional)
                $photoUrl = null;
                if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                    $uploadResult = uploadPhoto($_FILES['photo']);
                    if ($uploadResult['success']) {
                        $photoUrl = $uploadResult['path'];
                    } else {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'error' => $uploadResult['error']]);
                        exit;
                    }
                }
                
                // Insert into database
                $sql = "INSERT INTO testimonials (client_name, client_role, review_text, rating, photo_url) 
                        VALUES (:name, :role, :review, :rating, :photo)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':name' => $clientName,
                    ':role' => $clientRole,
                    ':review' => $reviewText,
                    ':rating' => $rating,
                    ':photo' => $photoUrl
                ]);
                
                $newId = $pdo->lastInsertId();
                logActivity($pdo, 'create_testimonial', 'testimonial', $newId, $clientName);
                
                echo json_encode(['success' => true, 'message' => 'Testimonial created successfully.', 'id' => $newId]);
                break;
                
            case 'delete':
                $id = intval($_POST['id'] ?? 0);
                
                if ($id <= 0) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Invalid ID.']);
                    exit;
                }
                
                // Get testimonial info for logging
                $stmt = $pdo->prepare("SELECT client_name, photo_url FROM testimonials WHERE id = ?");
                $stmt->execute([$id]);
                $testimonial = $stmt->fetch();
                
                if (!$testimonial) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Testimonial not found.']);
                    exit;
                }
                
                // Delete photo file if exists
                if ($testimonial['photo_url'] && file_exists(__DIR__ . '/../' . $testimonial['photo_url'])) {
                    unlink(__DIR__ . '/../' . $testimonial['photo_url']);
                }
                
                // Delete from database
                $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
                $stmt->execute([$id]);
                
                logActivity($pdo, 'delete_testimonial', 'testimonial', $id, $testimonial['client_name']);
                
                echo json_encode(['success' => true, 'message' => 'Testimonial deleted successfully.']);
                break;
                
            case 'toggle_active':
                $id = intval($_POST['id'] ?? 0);
                
                if ($id <= 0) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Invalid ID.']);
                    exit;
                }
                
                $stmt = $pdo->prepare("UPDATE testimonials SET is_active = NOT is_active WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true, 'message' => 'Status updated.']);
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// Invalid method
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>

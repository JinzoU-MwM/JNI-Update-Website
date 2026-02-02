<?php
/**
 * =====================================================
 * JNI Consultant - Authentication API
 * =====================================================
 * 
 * Handles:
 *   POST /admin/auth.php           - Login
 *   POST /admin/auth.php?logout=1  - Logout
 *   GET  /admin/auth.php?check=1   - Check session
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

// Include database configuration
require_once __DIR__ . '/../api/config.php';

/**
 * Log activity to database
 */
function logActivity($pdo, $userId, $username, $action, $targetType = null, $targetId = null, $targetTitle = null, $details = null) {
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
// Handle Logout
// =====================================================
if (isset($_GET['logout'])) {
    $username = $_SESSION['admin']['username'] ?? 'unknown';
    
    // Log logout activity
    try {
        $pdo = getDbConnection();
        logActivity($pdo, $_SESSION['admin']['id'] ?? null, $username, 'logout', 'session', null, null, 'User logged out');
    } catch (Exception $e) {
        // Continue even if logging fails
    }
    
    // Destroy session
    session_unset();
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}


// =====================================================
// Check Session Status
// =====================================================
if (isset($_GET['check'])) {
    if (isset($_SESSION['admin']) && $_SESSION['admin']['logged_in'] === true) {
        echo json_encode([
            'success' => true,
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['admin']['id'],
                'username' => $_SESSION['admin']['username'],
                'role' => $_SESSION['admin']['role']
            ],
            'csrf_token' => $_SESSION['csrf_token'] ?? null
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'logged_in' => false
        ]);
    }
    exit;
}


// =====================================================
// Handle Login (POST only)
// =====================================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get and sanitize input
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Username dan password wajib diisi']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Find user by username
    $sql = "SELECT id, username, email, password, role, is_active FROM users WHERE username = :username LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        // Log failed attempt
        logActivity($pdo, null, $username, 'login_failed', 'auth', null, null, 'Invalid username');
        
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Username atau password salah']);
        exit;
    }
    
    // Check if user is active
    if (!$user['is_active']) {
        logActivity($pdo, $user['id'], $username, 'login_blocked', 'auth', null, null, 'Account inactive');
        
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Akun tidak aktif. Hubungi administrator.']);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        logActivity($pdo, $user['id'], $username, 'login_failed', 'auth', null, null, 'Invalid password');
        
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Username atau password salah']);
        exit;
    }
    
    // Login successful - Create session
    $_SESSION['admin'] = [
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role'],
        'logged_in' => true,
        'login_time' => time()
    ];

    // Generate CSRF Token
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    
    // Update last login timestamp
    $updateSql = "UPDATE users SET last_login = NOW() WHERE id = :id";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([':id' => $user['id']]);
    
    // Log successful login
    logActivity($pdo, $user['id'], $username, 'login', 'auth', null, null, 'Login successful');
    
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'csrf_token' => $_SESSION['csrf_token'],
        'redirect' => 'dashboard.html'
    ]);
    
} catch (PDOException $e) {
    error_log("Auth Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Terjadi kesalahan server']);
}
?>

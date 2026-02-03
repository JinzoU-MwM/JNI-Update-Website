<?php
/**
 * =====================================================
 * Jamnasindo - Database Configuration
 * =====================================================
 * 
 * IMPORTANT: Update these values with your Hostinger 
 * MySQL database credentials from hPanel.
 * 
 * Location: hPanel > Databases > MySQL Databases
 */

// Database credentials
// Try to load from environment file (ignored by version control)
if (file_exists(__DIR__ . '/config.env.php')) {
    require_once __DIR__ . '/config.env.php';
} else {
    // Fallback defaults (Change these or use config.env.php)
    if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
    if (!defined('DB_NAME')) define('DB_NAME', 'your_db_name');
    if (!defined('DB_USER')) define('DB_USER', 'your_db_user');
    if (!defined('DB_PASS')) define('DB_PASS', 'your_db_password');
    if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');
}

/**
 * Get PDO Database Connection
 * Uses PDO with prepared statements for SQL injection prevention
 */
function getDbConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch (PDOException $e) {
            // Log error but don't expose details to client
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
    
    return $pdo;
}
?>

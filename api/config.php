<?php
/**
 * =====================================================
 * JNI Consultant - Database Configuration
 * =====================================================
 * 
 * IMPORTANT: Update these values with your Hostinger 
 * MySQL database credentials from hPanel.
 * 
 * Location: hPanel > Databases > MySQL Databases
 */

// Database credentials - UPDATE THESE!
define('DB_HOST', 'localhost');           // Usually 'localhost' on Hostinger
define('DB_NAME', 'u401270881_JNI_Marketing');      // Your database name
define('DB_USER', 'u401270881_MarketingJamna');    // Your database username
define('DB_PASS', '6K3e$t9u!3Z');  // Your database password
define('DB_CHARSET', 'utf8mb4');

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

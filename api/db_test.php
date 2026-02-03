<?php
/**
 * Jamnasindo - Database Connection Tester
 * Upload this file to your public_html/api/ folder and visit it in your browser.
 * e.g., https://yourdomain.com/api/db_test.php
 */

header('Content-Type: text/plain');

echo "========================================\n";
echo " DATABASE CONNECTION TEST \n";
echo "========================================\n\n";

// 1. Check Config File
if (file_exists('config.php')) {
    echo "[OK] config.php found.\n";
    require_once 'config.php';
} else {
    echo "[ERROR] config.php NOT found in the same directory.\n";
    echo "Please ensure config.php is in " . __DIR__ . "\n";
    exit;
}

// 2. Display Configured Credentials (masked password)
echo "\nChecking Configuration:\n";
echo "Host: " . DB_HOST . "\n";
echo "Database: " . DB_NAME . "\n";
echo "User: " . DB_USER . "\n";
echo "Password: " . str_repeat('*', strlen(DB_PASS)) . "\n";

// 3. Attempt Connection
echo "\nAttempting Connection...\n";

try {
    $conn = getDbConnection();
    echo "[SUCCESS] Connected to MySQL Database!\n";
    
    // 4. Check Tables
    echo "\nChecking Tables:\n";
    $tables = ['first_table', 'articles', 'users', 'activity_log', 'visitor_logs']; // Add your tables here
    
    $stmt = $conn->query("SHOW TABLES");
    $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($existingTables)) {
        echo "[WARNING] Database is empty. No tables found.\n";
        echo "--> ACTION: Import 'api/database.sql' and 'admin/admin_schema.sql' in phpMyAdmin.\n";
    } else {
        echo "Found " . count($existingTables) . " tables:\n";
        foreach ($existingTables as $table) {
            echo "- " . $table . "\n";
        }
        
        // Specific checks
        if (!in_array('articles', $existingTables)) {
             echo "\n[MISSING] 'articles' table is missing. Import api/database.sql\n";
        }
        if (!in_array('users', $existingTables)) {
             echo "\n[MISSING] 'users' table is missing. Import admin/admin_schema.sql\n";
        }
    }
    
} catch (Exception $e) {
    echo "[FAILED] Connection Error:\n";
    echo $e->getMessage() . "\n";
    echo "\nTroubleshooting Tips:\n";
    echo "1. Check if Database Name and User are correct in Hostinger.\n";
    echo "2. Check if the User has been assigned to the Database in Hostinger.\n";
    echo "3. Verify the Password is exactly as set in Hostinger.\n";
}
?>

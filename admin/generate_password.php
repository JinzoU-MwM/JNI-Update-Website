<?php
/**
 * =====================================================
 * Password Hash Generator
 * =====================================================
 * 
 * Run this file locally or on the server to generate
 * a secure password hash for your admin account.
 * 
 * Usage:
 *   1. Set your desired password below
 *   2. Run: php generate_password.php
 *   3. Copy the hash and update the database:
 *      UPDATE users SET password = 'YOUR_HASH' WHERE username = 'admin';
 * 
 * SECURITY: Delete this file after generating your password!
 */

// Include database connection
require_once __DIR__ . '/../api/config.php';

// Set password
$newPassword = 'admin123';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

echo "<h3>Resetting Password...</h3>";

try {
    $pdo = getDbConnection();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = 'admin'");
    $stmt->execute();
    
    if ($stmt->fetch()) {
        $update = $pdo->prepare("UPDATE users SET password = :pass WHERE username = 'admin'");
        $update->execute([':pass' => $hash]);
        echo "<div style='color: green; padding: 20px; border: 1px solid green; background: #e0ffe0;'>";
        echo "✅ Password for user <strong>'admin'</strong> has been reset to: <strong>$newPassword</strong><br>";
        echo "</div>";
    } else {
        echo "<div style='color: red;'>User 'admin' not found!</div>";
    }
    
    echo "<br><br><a href='login.html' style='font-size: 20px;'>Go to Login Page</a>";
    
} catch (Exception $e) {
    echo "<div style='color: red;'>Error: " . $e->getMessage() . "</div>";
}
?>

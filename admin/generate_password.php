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

// =====================================================
// SET YOUR PASSWORD HERE
// =====================================================
$password = 'Berhasil_123';  // Change this to your desired password

// =====================================================
// Generate Hash
// =====================================================
$hash = password_hash($password, PASSWORD_DEFAULT);

// Output
echo "=====================================================\n";
echo "JNI Consultant - Password Hash Generator\n";
echo "=====================================================\n\n";
echo "Password: $password\n";
echo "Hash:     $hash\n\n";
echo "SQL Update Command:\n";
echo "UPDATE users SET password = '$hash' WHERE username = 'admin';\n\n";
echo "=====================================================\n";
echo "IMPORTANT: Delete this file after use!\n";
echo "=====================================================\n";
?>

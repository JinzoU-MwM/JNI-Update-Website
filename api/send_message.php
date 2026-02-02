<?php
/**
 * =====================================================
 * JNI Consultant - Send Message API
 * =====================================================
 * 
 * Handles incoming messages from Contact Form and Bubble Chat.
 * 
 * Method: POST
 * Fields: name, email, phone, message, service_type, source
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Sanitize and Validate Inputs
    $name = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $phone = trim(filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING));
    $message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING));
    $serviceType = trim(filter_input(INPUT_POST, 'service_type', FILTER_SANITIZE_STRING));
    $source = trim(filter_input(INPUT_POST, 'source', FILTER_SANITIZE_STRING));
    
    // Defaults
    if (!$source || !in_array($source, ['contact_form', 'bubble_chat'])) {
        $source = 'contact_form';
    }

    if (empty($name) || empty($message) || (empty($email) && empty($phone))) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Mohon lengkapi Nama, Pesan, dan minimal satu kontak (Email/HP).']);
        exit;
    }

    // Insert into Database
    $sql = "INSERT INTO messages (name, email, phone, service_type, message, source, created_at) 
            VALUES (:name, :email, :phone, :service_type, :message, :source, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':service_type' => $serviceType,
        ':message' => $message,
        ':source' => $source
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Pesan Anda berhasil terkirim!']);

} catch (PDOException $e) {
    error_log("Message Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan sistem. Silakan coba lagi.']);
}
?>

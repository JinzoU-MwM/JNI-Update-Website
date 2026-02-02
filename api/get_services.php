<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $pdo = getDbConnection();
    
    // Fetch all services, ordered by creation (or a custom order field if added later)
    $stmt = $pdo->query("SELECT id, title, slug, short_description, icon_svg FROM services ORDER BY id ASC");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $services]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}

<?php
/**
 * =====================================================
 * TinyMCE Image Upload Handler
 * =====================================================
 * 
 * Handles drag & drop image uploads from the TinyMCE editor.
 * Returns JSON structure required by TinyMCE.
 */

session_start();

// Authentication Check
if (!isset($_SESSION['admin']) || $_SESSION['admin']['logged_in'] !== true) {
    header("HTTP/1.1 403 Forbidden");
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Configuration
$accepted_origins = ["http://localhost", "http://127.0.0.1"]; // Only needed for CORS if domain varies
$imageFolder = "../uploads/content/";
$maxSize = 5 * 1024 * 1024; // 5MB

if (isset($_SERVER['HTTP_ORIGIN'])) {
    if (in_array($_SERVER['HTTP_ORIGIN'], $accepted_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        header("HTTP/1.1 403 Forbidden");
        return;
    }
}

// Don't attempt to process the upload on an OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    return;
}

reset($_FILES);
$temp = current($_FILES);

if (is_uploaded_file($temp['tmp_name'])) {
    // Sanitize input
    if (preg_match("/([^\w\s\d\-_~,;:\[\]\(\).])|([\.]{2,})/", $temp['name'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('location' => 'Invalid file name.'));
        return;
    }

    // Verify extension
    $extension = strtolower(pathinfo($temp['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, array("jpg", "jpeg", "png", "webp", "gif"))) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('location' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'));
        return;
    }

    // Verify size
    if ($temp['size'] > $maxSize) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('location' => 'File too large. Max 5MB.'));
        return;
    }

    // Generate unique name
    $fileName = 'content_' . time() . '_' . uniqid() . '.' . $extension;
    $filetowrite = $imageFolder . $fileName;

    // Move uploaded file
    if (move_uploaded_file($temp['tmp_name'], $filetowrite)) {
        // Return JSON with location relative to web root
        // Adjust path based on your folder structure vs URL structure
        // If handler is in admin/ and uploads is in root/uploads/, then web path is uploads/content/
        $webPath = 'uploads/content/' . $fileName;
        echo json_encode(array('location' => $webPath));
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array('location' => 'Failed to save file.'));
    }
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(array('location' => 'No file uploaded.'));
}
?>

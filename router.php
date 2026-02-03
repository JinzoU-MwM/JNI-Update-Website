<?php
// router.php for PHP built-in server
// Usage: php -S localhost:8000 router.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestedFile = __DIR__ . $uri;

// 1. CRITICAL: API endpoints must bypass router to preserve POST data
if (strpos($uri, '/api/') === 0) {
    return false;  // Let PHP built-in server handle it directly
}

// 2. Serve actual files directly (static files AND .php files that exist)
if (file_exists($requestedFile) && !is_dir($requestedFile)) {
    // For PHP files, require them instead of returning false
    if (pathinfo($requestedFile, PATHINFO_EXTENSION) === 'php') {
        require $requestedFile;
        return true;
    }
    // For other files (CSS, JS, images), let the built-in server handle them
    return false;
}

// 2. Normalize URI (remove trailing slash)
$uri = rtrim($uri, '/');

// 3. Clean URL Routing (e.g., /about -> about.php, /admin/login -> admin/login.php)
if ($uri === '' || $uri === '/index') {
    require __DIR__ . '/index.php';
} elseif (file_exists(__DIR__ . $uri . '.php')) {
    require __DIR__ . $uri . '.php';
} else {
    // 404 Not Found
    http_response_code(404);
    echo "404 Not Found: " . htmlspecialchars($uri);
}

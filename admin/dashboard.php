<?php
session_start();
require_once '../api/config.php';

// 1. Authentication Check
function isLoggedIn() {
    return isset($_SESSION['admin']) && $_SESSION['admin']['logged_in'] === true;
}

if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$pdo = getDbConnection();
$page = $_GET['page'] ?? 'dashboard'; // Default page
$action = $_REQUEST['action'] ?? '';
$message = '';
$error = '';

// 2. Page Access Control (RBAC)
if (!canAccess($page)) {
    $error = "⛔ Akses Ditolak. Anda tidak memiliki izin untuk halaman ini.";
    $page = 'dashboard'; // Force redirect to dashboard view
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
function logActivity($pdo, $action, $targetType, $targetId, $targetTitle) {
    if (session_status() === PHP_SESSION_NONE) session_start();
    $userId = $_SESSION['admin']['id'] ?? 0;
    $username = $_SESSION['admin']['username'] ?? 'System';
    $sql = "INSERT INTO activity_log (user_id, username, action, target_type, target_id, target_title, details, ip_address, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $pdo->prepare($sql)->execute([$userId, $username, $action, $targetType, $targetId, $targetTitle, "Action: $action on $targetType", $_SERVER['REMOTE_ADDR']]);
}

// =====================================================
// ROLE-BASED ACCESS CONTROL
// =====================================================
function getUserRole() {
    return $_SESSION['admin']['role'] ?? 'editor';
}

function canAccess($page) {
    $role = getUserRole();
    
    // Define page permissions
    $permissions = [
        'admin' => ['dashboard', 'services', 'add_service', 'edit_service', 'list', 'add', 'edit', 'gallery', 'testimonials', 'messages', 'users', 'clients'],
        'editor' => ['dashboard', 'services', 'add_service', 'edit_service', 'list', 'add', 'edit', 'gallery', 'testimonials', 'clients'],
        'cs' => ['dashboard', 'messages']
    ];
    
    return in_array($page, $permissions[$role] ?? []);
}

function canDelete() {
    return getUserRole() === 'admin';
}

function handleFileUpload($file, $targetDir, $prefix) {
    if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!in_array($ext, $allowed)) return ['error' => 'Invalid file type.'];
    
    $fileName = $prefix . '_' . time() . '_' . uniqid() . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $targetDir . $fileName)) {
        return ['path' => str_replace('../', '', $targetDir) . $fileName];
    }
    return ['error' => 'Upload failed.'];
}

// =====================================================
// TINYMCE UPLOAD HANDLER (JSON RESPONSE)
// =====================================================
if ($action === 'upload_image') {
    header('Content-Type: application/json');
    if (isset($_FILES['file'])) { // TinyMCE sends 'file'
        $res = handleFileUpload($_FILES['file'], '../uploads/content/', 'content');
        if (isset($res['path'])) {
            echo json_encode(['location' => $res['path']]); // TinyMCE expects 'location'
        } else {
            http_response_code(500);
            echo json_encode(['error' => $res['error']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
    }
    exit;
}

// =====================================================
// POST HANDLERS
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // --- SAVE ARTICLE ---
    if ($action === 'save_article') {
        $id = $_POST['id'] ?? null;
        $title = trim($_POST['title']);
        $category = trim($_POST['category']);
        $content = $_POST['content'];
        $excerpt = trim($_POST['excerpt'] ?? '');
        $author = $_SESSION['admin']['username'] ?? 'Admin';
        
        // SEO Fields
        $metaTitle = trim($_POST['meta_title'] ?? '');
        $metaDesc = trim($_POST['meta_description'] ?? '');
        $focusKw = trim($_POST['focus_keyword'] ?? '');

        // Slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        
        // Image
        $imageUrl = $_POST['existing_image'] ?? '';
        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
            $res = handleFileUpload($_FILES['thumbnail'], '../uploads/thumbnails/', 'thumb');
            if (isset($res['path'])) $imageUrl = $res['path'];
            else $error = $res['error'];
        }

        if (!$error) {
            try {
                if ($id) {
                    $stmt = $pdo->prepare("UPDATE articles SET title=?, slug=?, category=?, content=?, excerpt=?, image_url=?, meta_title=?, meta_description=?, focus_keyword=?, updated_at=NOW() WHERE id=?");
                    $stmt->execute([$title, $slug, $category, $content, $excerpt, $imageUrl, $metaTitle, $metaDesc, $focusKw, $id]);
                    logActivity($pdo, 'update', 'article', $id, $title);
                    $message = "Artikel diperbarui!";
                } else {
                    $stmt = $pdo->prepare("INSERT INTO articles (title, slug, category, author, content, excerpt, image_url, meta_title, meta_description, focus_keyword, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())");
                    $stmt->execute([$title, $slug, $category, $author, $content, $excerpt, $imageUrl, $metaTitle, $metaDesc, $focusKw]);
                    logActivity($pdo, 'create', 'article', $pdo->lastInsertId(), $title);
                    $message = "Artikel berhasil disimpan!";
                }
            } catch (PDOException $e) { $error = "DB Error: " . $e->getMessage(); }
        }
    }

    // --- SAVE GALLERY ---
    elseif ($action === 'save_gallery') {
        $title = trim($_POST['title']);
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $res = handleFileUpload($_FILES['image'], '../uploads/gallery/', 'gal');
            if (isset($res['path'])) {
                $pdo->prepare("INSERT INTO gallery (title, image_url, created_at) VALUES (?, ?, NOW())")->execute([$title, $res['path']]);
                logActivity($pdo, 'create', 'gallery', $pdo->lastInsertId(), $title);
                $message = "Gambar berhasil diupload!";
            } else { $error = $res['error']; }
        } else { $error = "Pilih file gambar."; }
    }

    // --- SAVE TESTIMONIAL ---
    elseif ($action === 'save_testimonial') {
        $name = trim($_POST['client_name']);
        $role = trim($_POST['client_role']);
        $review = trim($_POST['review_text']);
        $rating = (int)$_POST['rating'];
        $photoUrl = '';
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $res = handleFileUpload($_FILES['photo'], '../uploads/testimonials/', 'testi');
            if (isset($res['path'])) $photoUrl = $res['path'];
        }
        $pdo->prepare("INSERT INTO testimonials (client_name, client_role, review_text, rating, photo_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())")->execute([$name, $role, $review, $rating, $photoUrl]);
        logActivity($pdo, 'create', 'testimonial', $pdo->lastInsertId(), $name);
        $message = "Testimonial disimpan!";
    }

    // --- SAVE CLIENT LOGO ---
    elseif ($action === 'save_client') {
        $clientName = trim($_POST['client_name']);
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $res = handleFileUpload($_FILES['logo'], '../assets/images/clients/', 'client');
            if (isset($res['path'])) {
                $pdo->prepare("INSERT INTO clients (client_name, logo_path, created_at) VALUES (?, ?, NOW())")->execute([$clientName, $res['path']]);
                logActivity($pdo, 'create', 'client', $pdo->lastInsertId(), $clientName);
                $message = "Logo klien berhasil ditambahkan!";
            } else { $error = $res['error']; }
        } else { $error = "Pilih file logo."; }
    }

    // --- SAVE SERVICE ---
    elseif ($action === 'save_service') {
        $id = $_POST['id'] ?? null;
        $title = trim($_POST['title']);
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $shortDesc = trim($_POST['short_description']);
        $fullDesc = $_POST['full_description'];
        $requirements = $_POST['requirements'];
        $benefits = $_POST['benefits'];
        $iconSvg = trim($_POST['icon_svg']); // Optional manual SVG input
        
        $paramArr = [$title, $slug, $shortDesc, $fullDesc, $requirements, $benefits, $iconSvg];
        
        // Handle Image Upload (Optional)
        $imageUrl = $_POST['existing_image'] ?? '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $res = handleFileUpload($_FILES['image'], '../uploads/services/', 'srv');
            if (isset($res['path'])) $imageUrl = $res['path'];
        }

        try {
            if ($id) {
                // UPDATE
                $sql = "UPDATE services SET title=?, slug=?, short_description=?, full_description=?, requirements=?, benefits=?, icon_svg=?";
                if ($imageUrl) { $sql .= ", image_url=?"; $paramArr[] = $imageUrl; }
                $sql .= ", updated_at=NOW() WHERE id=?";
                $paramArr[] = $id;
                
                $pdo->prepare($sql)->execute($paramArr);
                logActivity($pdo, 'update', 'service', $id, $title);
                $message = "Layanan berhasil diperbarui!";
            } else {
                // INSERT
                if ($imageUrl) {
                    $sql = "INSERT INTO services (title, slug, short_description, full_description, requirements, benefits, icon_svg, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                    $paramArr[] = $imageUrl;
                } else {
                    $sql = "INSERT INTO services (title, slug, short_description, full_description, requirements, benefits, icon_svg, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
                }
                $pdo->prepare($sql)->execute($paramArr);
                logActivity($pdo, 'create', 'service', $pdo->lastInsertId(), $title);
                $message = "Layanan berhasil ditambahkan!";
            }
        } catch (PDOException $e) { $error = "DB Error: " . $e->getMessage(); }
    }
    // --- SAVE USER (Admin Only) ---
    elseif ($action === 'save_user' && getUserRole() === 'admin') {
        $id = $_POST['id'] ?? null;
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $role = $_POST['role'];
        $password = $_POST['password'] ?? '';
        
        try {
            if ($id) {
                // UPDATE existing user
                if (!empty($password)) {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("UPDATE users SET username=?, email=?, role=?, password=? WHERE id=?");
                    $stmt->execute([$username, $email, $role, $hashedPassword, $id]);
                } else {
                    $stmt = $pdo->prepare("UPDATE users SET username=?, email=?, role=? WHERE id=?");
                    $stmt->execute([$username, $email, $role, $id]);
                }
                logActivity($pdo, 'update', 'user', $id, $username);
                $message = "User berhasil diperbarui!";
            } else {
                // INSERT new user
                if (empty($password)) {
                    $error = "Password wajib diisi untuk user baru.";
                } else {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
                    $stmt->execute([$username, $email, $hashedPassword, $role]);
                    logActivity($pdo, 'create', 'user', $pdo->lastInsertId(), $username);
                    $message = "User berhasil ditambahkan!";
                }
            }
        } catch (PDOException $e) { 
            $error = "DB Error: " . $e->getMessage(); 
        }
    }
}

// --- INIT DATABASE REMOVED PER USER REQUEST ---

// =====================================================
// GET HANDLERS (DELETE & FETCH)
// =====================================================
if (isset($_GET['delete']) && isset($_GET['type'])) {
    // Only Admin can delete
    if (!canDelete()) {
        $error = "⛔ Anda tidak memiliki izin untuk menghapus item.";
    } else {
        $id = (int)$_GET['delete'];
        $type = $_GET['type'];
        
        if ($type === 'message') {
            // --- DELETE MESSAGES ---
            $pdo->prepare("DELETE FROM messages WHERE id = ?")->execute([$id]);
            logActivity($pdo, 'delete', 'message', $id, "Message ID: $id");
            $message = "Pesan berhasil dihapus.";
        } else {
            // --- DELETE OTHER ITEMS ---
            $table = match ($type) {
                'gallery' => 'gallery',
                'testimonial' => 'testimonials',
                'article' => 'articles',
                'service' => 'services',
                'user' => 'users',
                'client' => 'clients',
                default => null
            };

            if ($table) {
                $pdo->prepare("DELETE FROM $table WHERE id = ?")->execute([$id]);
                logActivity($pdo, 'delete', $type, $id, "ID: $id");
                $message = "Item berhasil dihapus.";
            }
        }
    }
}

// Fetch Data for Views
$stats = [];
try {
    if ($page === 'dashboard') {
        $stats['articles'] = $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
        $stats['gallery'] = $pdo->query("SELECT COUNT(*) FROM gallery")->fetchColumn();
        $stats['testimonials'] = $pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        
        // Safely check for messages table
        try {
            $stats['messages'] = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
        } catch (PDOException $e) { $stats['messages'] = 0; }
        
        $stats['recent'] = $pdo->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 5")->fetchAll();
    }
    
    $galleryItems = ($page === 'gallery') ? $pdo->query("SELECT * FROM gallery ORDER BY created_at DESC")->fetchAll() : [];
    $testimonials = ($page === 'testimonials') ? $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll() : [];
    $articles = ($page === 'list') ? $pdo->query("SELECT * FROM articles ORDER BY created_at DESC")->fetchAll() : [];
    $services = ($page === 'services') ? $pdo->query("SELECT * FROM services ORDER BY created_at ASC")->fetchAll() : [];
    
    // Safely check for messages table
    $messages = [];
    if ($page === 'messages') {
        try {
            $messages = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll();
        } catch (PDOException $e) { 
            $error = "Tabel 'messages' belum ada di database. Harap import SQL secara manual."; 
        }
    }

    // Fetch users for admin
    $users = [];
    if ($page === 'users' && getUserRole() === 'admin') {
        try {
            $users = $pdo->query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC")->fetchAll();
        } catch (PDOException $e) { 
            $error = "Error loading users: " . $e->getMessage(); 
        }
    }

    // Fetch clients
    $clients = [];
    if ($page === 'clients') {
        try {
            $clients = $pdo->query("SELECT * FROM clients ORDER BY created_at DESC")->fetchAll();
        } catch (PDOException $e) { 
            $error = "Tabel 'clients' belum ada. Jalankan SQL CREATE TABLE clients terlebih dahulu."; 
        }
    }

} catch (PDOException $e) {
    $error = "Database Error: " . $e->getMessage();
}

// EDIT MODE for Article or Service
$editArticle = null;
$editService = null;

if ($page === 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editArticle = $stmt->fetch();
}

if ($page === 'edit_service' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editService = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JNI Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { background: #f4f6f9; min-height: 100vh; }
        .sidebar { background: #1e4d2b; color: white; min-height: 100vh; }
        .sidebar a { color: rgba(255,255,255,0.8); text-decoration: none; padding: 12px 20px; display: block; border-radius: 5px; margin-bottom: 5px; }
        .sidebar a:hover, .sidebar a.bg-success { background: rgba(255,255,255,0.2) !important; color: white; font-weight: 500; }
        .content { padding: 30px; }
        .card { border: none; shadow: 0 0 15px rgba(0,0,0,0.05); }
        .tox-promotion { display: none !important; }
        .message-row.unread { background-color: #f0fff4; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- SIDEBAR -->
            <div class="col-md-2 sidebar p-3 d-none d-md-block position-fixed">
                <h4 class="mb-4 text-center border-bottom pb-3">JNI Admin</h4>
                <small class="d-block text-center mb-3 opacity-75"><?= ucfirst(getUserRole()) ?></small>
                <nav class="nav flex-column">
                    <a href="dashboard.php?page=dashboard" class="<?= $page=='dashboard'?'bg-success':'' ?>">
                        <i class="bi bi-speedometer2 me-2"></i> Dashboard
                    </a>
                    
                    <?php if (in_array(getUserRole(), ['admin', 'editor'])): ?>
                        <a href="dashboard.php?page=services" class="<?= $page=='services'?'bg-success':'' ?>">
                            <i class="bi bi-briefcase me-2"></i> Layanan
                        </a>
                        <a href="dashboard.php?page=list" class="<?= $page=='list'?'bg-success':'' ?>">
                            <i class="bi bi-file-text me-2"></i> Artikel
                        </a>
                        <a href="dashboard.php?page=gallery" class="<?= $page=='gallery'?'bg-success':'' ?>">
                            <i class="bi bi-images me-2"></i> Galeri
                        </a>
                        <a href="dashboard.php?page=testimonials" class="<?= $page=='testimonials'?'bg-success':'' ?>">
                            <i class="bi bi-chat-quote me-2"></i> Testimonial
                        </a>
                        <a href="dashboard.php?page=clients" class="<?= $page=='clients'?'bg-success':'' ?>">
                            <i class="bi bi-building me-2"></i> Klien Kami
                        </a>
                    <?php endif; ?>
                    
                    <?php if (in_array(getUserRole(), ['admin', 'cs'])): ?>
                        <a href="dashboard.php?page=messages" class="<?= $page=='messages'?'bg-success':'' ?>">
                            <i class="bi bi-envelope me-2"></i> Pesan Masuk
                        </a>
                    <?php endif; ?>
                    
                    <?php if (getUserRole() === 'admin'): ?>
                        <a href="dashboard.php?page=users" class="<?= $page=='users'?'bg-success':'' ?>">
                            <i class="bi bi-people me-2"></i> Kelola Users
                        </a>
                    <?php endif; ?>
                    
                    <a href="auth?logout=1" class="mt-5 text-danger">
                        <i class="bi bi-box-arrow-left me-2"></i> Keluar
                    </a>
                </nav>
            </div>

            <!-- MAIN CONTENT -->
            <div class="col-md-10 offset-md-2 content">
                <?php if ($message): ?><div class="alert alert-success alert-dismissible fade show"><?= $message ?><button class='btn-close' data-bs-dismiss='alert'></button></div><?php endif; ?>
                <?php if ($error): ?><div class="alert alert-danger alert-dismissible fade show"><?= $error ?><button class='btn-close' data-bs-dismiss='alert'></button></div><?php endif; ?>

                <!-- === DASHBOARD === -->
                <?php if ($page === 'dashboard'): ?>
                    <h2 class="mb-4">Dashboard Overview</h2>
                    <div class="row g-4 mb-4">
                        <div class="col-md-3">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-success">
                                <h3><?= $stats['articles'] ?></h3>
                                <p class="text-muted mb-0">Total Artikel</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-primary">
                                <h3><?= $stats['gallery'] ?></h3>
                                <p class="text-muted mb-0">Total Galeri</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-warning">
                                <h3><?= $stats['testimonials'] ?></h3>
                                <p class="text-muted mb-0">Total Testimonial</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-info">
                                <h3><?= $stats['messages'] ?></h3>
                                <p class="text-muted mb-0">Pesan Masuk</p>
                            </div>
                        </div>
                    </div>

                    <!-- === ANALYTICS SECTION === -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-8">
                            <div class="card p-4 shadow-sm h-100">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="mb-0">Traffic Overview (Last 30 Days)</h4>
                                </div>
                                <canvas id="trafficChart" height="120"></canvas>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card p-4 shadow-sm h-100">
                                <h4 class="mb-3">Devices</h4>
                                <canvas id="deviceChart" height="200"></canvas>
                                <hr class="my-4">
                                <h4 class="mb-3">Top Pages</h4>
                                <ul class="list-group list-group-flush" id="topPagesList">
                                    <li class="list-group-item text-muted">Loading...</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="card p-3">
                        <h5>Aktivitas Terbaru</h5>
                        <ul class="list-group list-group-flush">
                            <?php foreach ($stats['recent'] as $log): ?>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span><?= htmlspecialchars($log['details']) ?> <small class="text-muted">(<?= $log['username'] ?>)</small></span>
                                    <small class="text-muted"><?= date('d M H:i', strtotime($log['created_at'])) ?></small>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                <!-- === MESSAGES (INBOX) === -->
                <?php elseif ($page === 'messages'): ?>
                    <h3>Pesan Masuk</h3>
                    <div class="table-responsive bg-white shadow-sm rounded">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nama</th>
                                    <th>Kontak</th>
                                    <th>Source</th>
                                    <th>Pesan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($messages as $msg): ?>
                                <tr class="message-row">
                                    <td class="small text-muted" style="white-space:nowrap;"><?= date('d M Y H:i', strtotime($msg['created_at'])) ?></td>
                                    <td class="fw-bold"><?= htmlspecialchars($msg['name']) ?></td>
                                    <td>
                                        <?php if($msg['phone']): ?>
                                            <div><i class="bi bi-whatsapp text-success"></i> <?= htmlspecialchars($msg['phone']) ?></div>
                                        <?php endif; ?>
                                        <?php if($msg['email']): ?>
                                            <div class="small text-muted"><i class="bi bi-envelope"></i> <?= htmlspecialchars($msg['email']) ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge <?= $msg['source']=='bubble_chat' ? 'bg-info' : 'bg-secondary' ?>">
                                            <?= $msg['source']=='bubble_chat' ? 'Chat Widget' : 'Contact Form' ?>
                                        </span>
                                    </td>
                                    <td><?= htmlspecialchars(substr($msg['message'], 0, 40)) ?>...</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#msgModal<?= $msg['id'] ?>"><i class="bi bi-eye"></i></button>
                                        <a href="dashboard.php?page=messages&delete=<?= $msg['id'] ?>&type=message" class="btn btn-sm btn-outline-danger" onclick="return confirm('Hapus pesan ini?')"><i class="bi bi-trash"></i></a>
                                    </td>
                                </tr>

                                <!-- Message Detail Modal -->
                                <div class="modal fade" id="msgModal<?= $msg['id'] ?>" tabindex="-1">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Pesan dari <?= htmlspecialchars($msg['name']) ?></h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <p><strong>Service Type:</strong> <?= htmlspecialchars($msg['service_type'] ?? '-') ?></p>
                                                <p><strong>Email:</strong> <?= htmlspecialchars($msg['email'] ?? '-') ?></p>
                                                <p><strong>Phone:</strong> <?= htmlspecialchars($msg['phone'] ?? '-') ?></p>
                                                <hr>
                                                <p class="bg-light p-3 rounded"><?= nl2br(htmlspecialchars($msg['message'])) ?></p>
                                            </div>
                                            <div class="modal-footer">
                                                <?php if($msg['phone']): 
                                                    $cleanPhone = preg_replace('/[^0-9]/', '', $msg['phone']);
                                                    if (substr($cleanPhone, 0, 1) == '0') $cleanPhone = '62' . substr($cleanPhone, 1);
                                                ?>
                                                    <a href="https://wa.me/<?= $cleanPhone ?>?text=Halo <?= urlencode($msg['name']) ?>, terima kasih telah menghubungi Jamnasindo." target="_blank" class="btn btn-success"><i class="bi bi-whatsapp"></i> Reply via WA</a>
                                                <?php endif; ?>
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                        <?php if(empty($messages)): ?>
                            <div class="p-4 text-center text-muted">Belum ada pesan masuk.</div>
                        <?php endif; ?>
                    </div>

                <!-- === GALLERY === -->                <?php elseif ($page === 'gallery'): ?>
                    <h3>Manajemen Galeri</h3>
                    <div class="card mb-4 p-4 shadow-sm">
                        <form method="POST" enctype="multipart/form-data" class="row align-items-end g-3">
                            <input type="hidden" name="action" value="save_gallery">
                            <div class="col-md-5">
                                <label class="form-label">Judul Gambar</label>
                                <input type="text" name="title" class="form-control" required>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">File Gambar</label>
                                <input type="file" name="image" class="form-control" required>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-success w-100">Upload</button>
                            </div>
                        </form>
                    </div>
                    <div class="row g-3">
                        <?php foreach ($galleryItems as $item): ?>
                        <div class="col-md-3">
                            <div class="card h-100 shadow-sm">
                                <img src="../<?= $item['image_url'] ?>" class="card-img-top" style="height: 150px; object-fit: cover;">
                                <div class="card-body p-2 d-flex justify-content-between align-items-center">
                                    <small><?= htmlspecialchars($item['title'] ?? 'No Title') ?></small>
                                    <?php if (canDelete()): ?>
                                        <a href="dashboard.php?page=gallery&delete=<?= $item['id'] ?>&type=gallery" class="btn btn-sm btn-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>

                <!-- === TESTIMONIALS === -->
                <?php elseif ($page === 'testimonials'): ?>
                    <h3>Manajemen Testimonial</h3>
                    <div class="card mb-4 p-4 shadow-sm">
                        <form method="POST" enctype="multipart/form-data" class="row g-3">
                            <input type="hidden" name="action" value="save_testimonial">
                            <div class="col-md-4">
                                <label class="form-label">Nama Klien</label>
                                <input type="text" name="client_name" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Role/Jabatan</label>
                                <input type="text" name="client_role" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Rating</label>
                                <select name="rating" class="form-select">
                                    <option value="5">⭐⭐⭐⭐⭐</option>
                                    <option value="4">⭐⭐⭐⭐</option>
                                    <option value="3">⭐⭐⭐</option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Review</label>
                                <textarea name="review_text" class="form-control" rows="2" required></textarea>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Foto (Opsional)</label>
                                <input type="file" name="photo" class="form-control">
                            </div>
                            <div class="col-12"><button class="btn btn-success">Simpan Testimonial</button></div>
                        </form>
                    </div>
                    <table class="table table-hover bg-white shadow-sm">
                        <thead><tr><th>Klien</th><th>Rating</th><th>Review</th><th>Aksi</th></tr></thead>
                        <tbody>
                            <?php foreach ($testimonials as $t): ?>
                            <tr>
                                <td>
                                    <?php if($t['photo_url']): ?>
                                        <img src="../<?= $t['photo_url'] ?>" width="30" class="rounded-circle me-1">
                                    <?php endif; ?>
                                    <b><?= htmlspecialchars($t['client_name']) ?></b>
                                    <small class="d-block text-muted"><?= htmlspecialchars($t['client_role']) ?></small>
                                </td>
                                <td><?= $t['rating'] ?>/5</td>
                                <td><?= htmlspecialchars(substr($t['review_text'], 0, 50)) ?>...</td>
                                <td>
                                    <?php if (canDelete()): ?>
                                        <a href="dashboard.php?page=testimonials&delete=<?= $t['id'] ?>&type=testimonial" class="btn btn-sm btn-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                <!-- === SERVICES MANAGEMENT === -->
                <?php elseif ($page === 'services'): ?>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Manajemen Layanan</h3>
                        <a href="dashboard.php?page=add_service" class="btn btn-success"><i class="bi bi-plus-lg"></i> Tambah Layanan</a>
                    </div>
                    <table class="table table-hover bg-white shadow-sm align-middle">
                        <thead class="table-light"><tr><th>Icon</th><th>Layanan</th><th>Deskripsi Singkat</th><th>Aksi</th></tr></thead>
                        <tbody>
                            <?php foreach ($services as $srv): ?>
                            <tr>
                                <td>
                                    <?php if($srv['icon_svg']): ?>
                                        <div style="width:32px; height:32px; color:green;"><?= $srv['icon_svg'] ?></div>
                                    <?php else: ?>
                                        <div class="bg-light rounded p-1" style="width:32px; height:32px;"></div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <b><?= htmlspecialchars($srv['title']) ?></b><br>
                                    <small class="text-muted">/<?= htmlspecialchars($srv['slug']) ?></small>
                                </td>
                                <td><?= htmlspecialchars(substr($srv['short_description'], 0, 50)) ?>...</td>
                                <td>
                                    <a href="dashboard.php?page=edit_service&id=<?= $srv['id'] ?>" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></a>
                                    <?php if (canDelete()): ?>
                                        <a href="dashboard.php?page=services&delete=<?= $srv['id'] ?>&type=service" class="btn btn-sm btn-outline-danger" onclick="return confirm('Hapus Layanan?')"><i class="bi bi-trash"></i></a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                <!-- === ADD/EDIT SERVICE === -->
                <?php elseif ($page === 'add_service' || $page === 'edit_service'): ?>
                    <h2><?= $page==='edit_service' ? 'Edit Layanan' : 'Tambah Layanan Baru' ?></h2>
                    <div class="card mt-3 shadow-sm p-4">
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="action" value="save_service">
                            <?php if ($editService): ?>
                                <input type="hidden" name="id" value="<?= $editService['id'] ?>">
                                <input type="hidden" name="existing_image" value="<?= $editService['image_url'] ?>">
                            <?php endif; ?>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Judul Layanan</label>
                                    <input type="text" name="title" class="form-control" required value="<?= $editService['title'] ?? '' ?>">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Gambar Header (Opsional)</label>
                                    <input type="file" name="image" class="form-control">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Deskripsi Singkat (Untuk Kartu di Homepage)</label>
                                <textarea name="short_description" class="form-control" rows="2" maxlength="250" required><?= $editService['short_description'] ?? '' ?></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">SVG Icon Code (Optional, copy from Heroicons/Phosphor)</label>
                                <input type="text" name="icon_svg" class="form-control font-monospace" placeholder="<svg>...</svg>" value="<?= htmlspecialchars($editService['icon_svg'] ?? '') ?>">
                            </div>

                            <hr class="my-4">
                            <h5>Detail Halaman Layanan</h5>

                            <div class="mb-3">
                                <label class="form-label">Deskripsi Lengkap (Tentang Layanan)</label>
                                <textarea id="desc_editor" name="full_description" class="form-control"><?= $editService['full_description'] ?? '' ?></textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Persyaratan (List)</label>
                                    <textarea id="req_editor" name="requirements" class="form-control"><?= $editService['requirements'] ?? '' ?></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Keuntungan / Manfaat</label>
                                    <textarea id="benefit_editor" name="benefits" class="form-control"><?= $editService['benefits'] ?? '' ?></textarea>
                                </div>
                            </div>

                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <a href="dashboard.php?page=services" class="btn btn-secondary">Batal</a>
                                <button type="submit" class="btn btn-success">Simpan Layanan</button>
                            </div>
                        </form>
                    </div>
                    <script>
                        const commonConfig = {
                            plugins: 'lists link table',
                            toolbar: 'bold italic | bullist numlist | link',
                            menubar: false,
                            height: 300,
                            setup: function (editor) {
                                editor.on('change', function () {
                                    editor.save();
                                });
                            }
                        };
                        
                        tinymce.remove(); // Clear existing
                        tinymce.init({ ...commonConfig, selector: '#desc_editor', height: 400 });
                        tinymce.init({ ...commonConfig, selector: '#req_editor' });
                        tinymce.init({ ...commonConfig, selector: '#benefit_editor' });
                    </script>

                <!-- === ARTICLE LIST === -->
                <?php elseif ($page === 'list'): ?>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Daftar Artikel</h2>
                        <a href="dashboard.php?page=add" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Tambah Baru</a>
                    </div>
                    <table class="table table-hover bg-white shadow-sm align-middle">
                        <thead class="table-light"><tr><th>Img</th><th>Judul</th><th>Kategori</th><th>Tgl</th><th>Aksi</th></tr></thead>
                        <tbody>
                            <?php foreach ($articles as $art): ?>
                            <tr>
                                <td>
                                    <?php if($art['image_url']): ?>
                                        <img src="../<?= htmlspecialchars($art['image_url']) ?>" width="50" height="40" style="object-fit: cover; border-radius: 4px;">
                                    <?php else: ?>
                                        <span class="text-muted">No Image</span>
                                    <?php endif; ?>
                                </td>
                                <td><?= htmlspecialchars($art['title']) ?></td>
                                <td><span class="badge bg-secondary"><?= htmlspecialchars($art['category']) ?></span></td>
                                <td><?= date('d M Y', strtotime($art['created_at'])) ?></td>
                                <td>
                                    <a href="dashboard.php?page=edit&id=<?= $art['id'] ?>" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></a>
                                    <?php if (canDelete()): ?>
                                        <a href="dashboard.php?page=list&delete=<?= $art['id'] ?>&type=article" class="btn btn-sm btn-outline-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                <!-- === ADD/EDIT ARTICLE === -->
                <?php elseif ($page === 'add' || $page === 'edit'): ?>
                    <h2><?= $page==='edit' ? 'Edit Artikel' : 'Tambah Artikel Baru' ?></h2>
                    <div class="card mt-3 shadow-sm p-4">
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="action" value="save_article">
                            <?php if ($editArticle): ?>
                                <input type="hidden" name="id" value="<?= $editArticle['id'] ?>">
                                <input type="hidden" name="existing_image" value="<?= $editArticle['image_url'] ?>">
                            <?php endif; ?>
                            
                            <div class="mb-3">
                                <label class="form-label">Judul Artikel</label>
                                <input type="text" name="title" class="form-control" required value="<?= $editArticle['title'] ?? '' ?>">
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Kategori</label>
                                    <select name="category" class="form-select">
                                        <?php $cat = $editArticle['category'] ?? ''; ?>
                                        <option <?= $cat=='Berita'?'selected':'' ?>>Berita</option>
                                        <option <?= $cat=='Tips Bisnis'?'selected':'' ?>>Tips Bisnis</option>
                                        <option <?= $cat=='Perizinan'?'selected':'' ?>>Perizinan</option>
                                        <option <?= $cat=='Umum'?'selected':'' ?>>Umum</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Thumbnail Image</label>
                                    <input type="file" name="thumbnail" class="form-control" accept="image/*">
                                    <?php if(isset($editArticle['image_url'])): ?>
                                        <small class="text-muted">Current: <?= $editArticle['image_url'] ?></small>
                                    <?php endif; ?>
                                </div>
                            </div>
                            
                            <!-- SEO Fields -->
                            <div class="card bg-light p-3 mb-3">
                                <h6>SEO Settings (Optional)</h6>
                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <input type="text" name="meta_title" class="form-control form-control-sm" placeholder="Meta Title" value="<?= $editArticle['meta_title'] ?? '' ?>">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <input type="text" name="focus_keyword" class="form-control form-control-sm" placeholder="Focus Keyword" value="<?= $editArticle['focus_keyword'] ?? '' ?>">
                                    </div>
                                    <div class="col-12">
                                        <textarea name="meta_description" class="form-control form-control-sm" placeholder="Meta Description" rows="2"><?= $editArticle['meta_description'] ?? '' ?></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Konten Artikel</label>
                                <textarea id="editor" name="content" class="form-control" rows="15"><?= $editArticle['content'] ?? '' ?></textarea>
                            </div>

                            <div class="d-flex justify-content-end gap-2">
                                <a href="dashboard.php?page=list" class="btn btn-secondary">Batal</a>
                                <button type="submit" class="btn btn-success">Simpan Artikel</button>
                            </div>
                        </form>
                    </div>
                    <script>
                        tinymce.init({
                            selector: '#editor',
                            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | align lineheight | numlist bullist indent outdent | removeformat',
                            images_upload_url: 'dashboard.php?action=upload_image',
                            automatic_uploads: true,
                            height: 500
                        });
                    </script>

                <!-- === USERS MANAGEMENT (Admin Only) === -->
                <?php elseif ($page === 'users' && getUserRole() === 'admin'): ?>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Kelola Users</h3>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addUserModal">
                            <i class="bi bi-plus-lg"></i> Tambah User
                        </button>
                    </div>
                    
                    <div class="table-responsive bg-white shadow-sm rounded">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Dibuat</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($users as $user): ?>
                                <tr>
                                    <td class="fw-bold"><?= htmlspecialchars($user['username']) ?></td>
                                    <td><?= htmlspecialchars($user['email']) ?></td>
                                    <td>
                                        <?php 
                                        $roleBadge = match($user['role']) {
                                            'admin' => 'bg-danger',
                                            'editor' => 'bg-primary',
                                            'cs' => 'bg-info',
                                            default => 'bg-secondary'
                                        };
                                        ?>
                                        <span class="badge <?= $roleBadge ?>"><?= ucfirst($user['role']) ?></span>
                                    </td>
                                    <td class="small text-muted"><?= date('d M Y', strtotime($user['created_at'])) ?></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#editUserModal<?= $user['id'] ?>">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <?php if ($user['id'] != $_SESSION['admin']['id']): ?>
                                            <a href="dashboard.php?page=users&delete=<?= $user['id'] ?>&type=user" 
                                               class="btn btn-sm btn-outline-danger" 
                                               onclick="return confirm('Hapus user ini?')">
                                                <i class="bi bi-trash"></i>
                                            </a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                
                                <!-- Edit User Modal -->
                                <div class="modal fade" id="editUserModal<?= $user['id'] ?>" tabindex="-1">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <form method="POST">
                                                <input type="hidden" name="action" value="save_user">
                                                <input type="hidden" name="id" value="<?= $user['id'] ?>">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Edit User: <?= htmlspecialchars($user['username']) ?></h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="mb-3">
                                                        <label class="form-label">Username</label>
                                                        <input type="text" name="username" class="form-control" value="<?= htmlspecialchars($user['username']) ?>" required>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">Email</label>
                                                        <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($user['email']) ?>" required>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">Role</label>
                                                        <select name="role" class="form-select" required>
                                                            <option value="admin" <?= $user['role']==='admin'?'selected':'' ?>>Admin</option>
                                                            <option value="editor" <?= $user['role']==='editor'?'selected':'' ?>>Editor</option>
                                                            <option value="cs" <?= $user['role']==='cs'?'selected':'' ?>>Customer Service</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">Password Baru (Kosongkan jika tidak diubah)</label>
                                                        <input type="password" name="password" class="form-control" placeholder="••••••••">
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                                    <button type="submit" class="btn btn-success">Simpan Perubahan</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                        <?php if(empty($users)): ?>
                            <div class="p-4 text-center text-muted">Belum ada user.</div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Add User Modal -->
                    <div class="modal fade" id="addUserModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form method="POST">
                                    <input type="hidden" name="action" value="save_user">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Tambah User Baru</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label class="form-label">Username</label>
                                            <input type="text" name="username" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" name="email" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Password</label>
                                            <input type="password" name="password" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Role</label>
                                            <select name="role" class="form-select" required>
                                                <option value="editor">Editor</option>
                                                <option value="cs">Customer Service</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                        <button type="submit" class="btn btn-success">Tambah User</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                <!-- === CLIENTS / KLIEN KAMI === -->
                <?php elseif ($page === 'clients'): ?>
                    <h3 class="mb-4">Kelola Logo Klien</h3>
                    
                    <!-- Upload Form -->
                    <div class="card mb-4 p-4 shadow-sm">
                        <form method="POST" enctype="multipart/form-data" class="row align-items-end g-3">
                            <input type="hidden" name="action" value="save_client">
                            <div class="col-md-5">
                                <label class="form-label">Nama Klien/Perusahaan</label>
                                <input type="text" name="client_name" class="form-control" placeholder="PT. Nama Perusahaan" required>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">Logo (PNG/JPG, transparent recommended)</label>
                                <input type="file" name="logo" class="form-control" accept="image/*" required>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-success w-100"><i class="bi bi-upload me-1"></i> Upload</button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Logo Grid -->
                    <div class="row g-3">
                        <?php foreach ($clients as $client): ?>
                        <div class="col-6 col-md-3 col-lg-2">
                            <div class="card h-100 shadow-sm text-center p-3">
                                <img src="../<?= htmlspecialchars($client['logo_path']) ?>" 
                                     alt="<?= htmlspecialchars($client['client_name']) ?>" 
                                     class="img-fluid mb-2" 
                                     style="max-height: 80px; object-fit: contain; filter: grayscale(100%); opacity: 0.7; transition: all 0.3s;"
                                     onmouseover="this.style.filter='none'; this.style.opacity='1';"
                                     onmouseout="this.style.filter='grayscale(100%)'; this.style.opacity='0.7';">
                                <small class="d-block text-muted text-truncate"><?= htmlspecialchars($client['client_name']) ?></small>
                                <?php if (canDelete()): ?>
                                    <a href="dashboard.php?page=clients&delete=<?= $client['id'] ?>&type=client" 
                                       class="btn btn-sm btn-outline-danger mt-2" 
                                       onclick="return confirm('Hapus logo ini?')">
                                        <i class="bi bi-trash"></i>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <?php if(empty($clients)): ?>
                        <div class="p-4 text-center text-muted">Belum ada logo klien ditambahkan.</div>
                    <?php endif; ?>

                <?php endif; ?>

            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Analytics Logic
        document.addEventListener('DOMContentLoaded', function() {
            // Check if we are on dashboard page
            if (!document.getElementById('trafficChart')) return;

            // Fetch Analytics Data
            fetch('../api/analytics.php?action=daily_views&days=30')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const ctx = document.getElementById('trafficChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: data.data.map(item => item.label),
                                datasets: [{
                                    label: 'Visits',
                                    data: data.data.map(item => item.views),
                                    borderColor: '#1e4d2b',
                                    backgroundColor: 'rgba(30, 77, 43, 0.1)',
                                    fill: true,
                                    tension: 0.4
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                            }
                        });
                    }
                });

            fetch('../api/analytics.php?action=devices&days=30')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const ctx = document.getElementById('deviceChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'doughnut',
                            data: {
                                labels: Object.keys(data.data.devices),
                                datasets: [{
                                    data: Object.values(data.data.devices),
                                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
                                }]
                            },
                            options: { responsive: true }
                        });
                    }
                });

            fetch('../api/analytics.php?action=top_pages&limit=5')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const list = document.getElementById('topPagesList');
                        list.innerHTML = '';
                        data.data.forEach(page => {
                            list.innerHTML += `
                                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span class="text-truncate" style="max-width: 200px;">${page.page_url}</span>
                                    <span class="badge bg-light text-dark rounded-pill">${page.views}</span>
                                </li>
                            `;
                        });
                    }
                });
        });
    </script>
</body>
</html>

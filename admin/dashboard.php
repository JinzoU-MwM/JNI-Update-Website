<?php
session_start();
require_once 'auth.php';
require_once '../api/config.php';

// 1. Authentication Check
if (!isLoggedIn()) {
    header('Location: login.html');
    exit;
}

$pdo = getDbConnection();
$page = $_GET['page'] ?? 'dashboard'; // Default page
$action = $_REQUEST['action'] ?? '';
$message = '';
$error = '';

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
}

// =====================================================
// GET HANDLERS (DELETE & FETCH)
// =====================================================
if (isset($_GET['delete']) && isset($_GET['type'])) {
    $id = (int)$_GET['delete'];
    $type = $_GET['type'];
    $table = ($type === 'gallery') ? 'gallery' : (($type === 'testimonial') ? 'testimonials' : 'articles');
    $pdo->prepare("DELETE FROM $table WHERE id = ?")->execute([$id]);
    logActivity($pdo, 'delete', $type, $id, "ID: $id");
    $message = "Item berhasil dihapus.";
}

// Fetch Data for Views
$stats = [];
if ($page === 'dashboard') {
    $stats['articles'] = $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
    $stats['gallery'] = $pdo->query("SELECT COUNT(*) FROM gallery")->fetchColumn();
    $stats['testimonials'] = $pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    $stats['recent'] = $pdo->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 5")->fetchAll();
}
$galleryItems = ($page === 'gallery') ? $pdo->query("SELECT * FROM gallery ORDER BY created_at DESC")->fetchAll() : [];
$testimonials = ($page === 'testimonials') ? $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll() : [];
$articles = ($page === 'list') ? $pdo->query("SELECT * FROM articles ORDER BY created_at DESC")->fetchAll() : [];

// EDIT MODE for Article
$editArticle = null;
if ($page === 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editArticle = $stmt->fetch();
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
    <style>
        body { background: #f4f6f9; min-height: 100vh; }
        .sidebar { background: #1e4d2b; color: white; min-height: 100vh; }
        .sidebar a { color: rgba(255,255,255,0.8); text-decoration: none; padding: 12px 20px; display: block; border-radius: 5px; margin-bottom: 5px; }
        .sidebar a:hover, .sidebar a.bg-success { background: rgba(255,255,255,0.2) !important; color: white; font-weight: 500; }
        .content { padding: 30px; }
        .card { border: none; shadow: 0 0 15px rgba(0,0,0,0.05); }
        .tox-promotion { display: none !important; }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- SIDEBAR -->
            <div class="col-md-2 sidebar p-3 d-none d-md-block position-fixed">
                <h4 class="mb-4 text-center border-bottom pb-3">JNI Admin</h4>
                <nav class="nav flex-column">
                    <a href="dashboard.php?page=dashboard" class="<?= $page=='dashboard'?'bg-success':'' ?>"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a>
                    <a href="dashboard.php?page=list" class="<?= $page=='list'?'bg-success':'' ?>"><i class="bi bi-file-text me-2"></i> Artikel</a>
                    <a href="dashboard.php?page=gallery" class="<?= $page=='gallery'?'bg-success':'' ?>"><i class="bi bi-images me-2"></i> Galeri</a>
                    <a href="dashboard.php?page=testimonials" class="<?= $page=='testimonials'?'bg-success':'' ?>"><i class="bi bi-chat-quote me-2"></i> Testimonial</a>
                    <a href="logout.php" class="mt-5 text-danger"><i class="bi bi-box-arrow-left me-2"></i> Keluar</a>
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
                        <div class="col-md-4">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-success">
                                <h3><?= $stats['articles'] ?></h3>
                                <p class="text-muted mb-0">Total Artikel</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-primary">
                                <h3><?= $stats['gallery'] ?></h3>
                                <p class="text-muted mb-0">Total Galeri</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card p-3 bg-white shadow-sm border-start border-4 border-warning">
                                <h3><?= $stats['testimonials'] ?></h3>
                                <p class="text-muted mb-0">Total Testimonial</p>
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

                <!-- === GALLERY === -->
                <?php elseif ($page === 'gallery'): ?>
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
                                    <a href="dashboard.php?page=gallery&delete=<?= $item['id'] ?>&type=gallery" class="btn btn-sm btn-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a>
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
                                <td><a href="dashboard.php?page=testimonials&delete=<?= $t['id'] ?>&type=testimonial" class="btn btn-sm btn-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

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
                                    <a href="dashboard.php?page=list&delete=<?= $art['id'] ?>&type=article" class="btn btn-sm btn-outline-danger" onclick="return confirm('Hapus?')"><i class="bi bi-trash"></i></a>
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
                <?php endif; ?>

            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

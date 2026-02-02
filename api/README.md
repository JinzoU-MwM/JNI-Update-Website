# JNI Consultant - PHP/MySQL API

## 📁 Folder Structure

```
public_html/              ← Your Hostinger root folder
├── api/
│   ├── config.php        ← Database credentials (EDIT THIS!)
│   ├── get_articles.php  ← Articles API endpoint
│   └── database.sql      ← Run in phpMyAdmin
├── assets/
│   ├── css/
│   ├── js/
│   │   └── modules/
│   │       └── article.js ← Fetches from API
│   └── images/
├── index.html
├── blog.html
├── article.html
└── ...
```

---

## 🚀 Setup Instructions for Hostinger

### Step 1: Create MySQL Database

1. Login to **hPanel** → Go to **Databases** → **MySQL Databases**
2. Create a new database (e.g., `u123456789_jni`)
3. Create a database user and password
4. Note down your credentials:
   - Database Name
   - Database Username
   - Database Password
   - Host (usually `localhost`)

### Step 2: Import Database Schema

1. Go to **hPanel** → **Databases** → **phpMyAdmin**
2. Select your database
3. Click **Import** tab
4. Upload `api/database.sql` file
5. Click **Go** to execute

### Step 3: Configure Database Connection

1. Open `api/config.php` in File Manager or FTP
2. Update these values:

```php
define('DB_HOST', 'localhost');           // Usually localhost
define('DB_NAME', 'u123456789_jni');      // Your database name
define('DB_USER', 'u123456789_admin');    // Your database username  
define('DB_PASS', 'YourSecurePassword!'); // Your database password
```

### Step 4: Upload Files

1. Go to **hPanel** → **Files** → **File Manager**
2. Navigate to `public_html`
3. Create `api` folder if not exists
4. Upload:
   - `config.php` → `/public_html/api/`
   - `get_articles.php` → `/public_html/api/`
5. Upload updated JS:
   - `article.js` → `/public_html/assets/js/modules/`

### Step 5: Test API

Open in browser:
- **List all:** `https://yourdomain.com/api/get_articles.php`
- **Single:** `https://yourdomain.com/api/get_articles.php?slug=panduan-izin-ppiu-2024`

---

## 📝 Managing Articles

### Add New Article

```sql
INSERT INTO articles (slug, title, category, author, image_url, excerpt, content, read_time) 
VALUES (
    'article-slug',
    'Article Title',
    'Category',
    'Admin',
    'https://image-url...',
    'Short excerpt...',
    '<p>Full HTML content...</p>',
    '5 menit baca'
);
```

### Edit Article

```sql
UPDATE articles SET 
    title = 'New Title',
    content = '<p>Updated content...</p>'
WHERE slug = 'article-slug';
```

### Delete Article (Soft)

```sql
UPDATE articles SET is_published = 0 WHERE slug = 'article-slug';
```

### Delete Article (Permanent)

```sql
DELETE FROM articles WHERE slug = 'article-slug';
```

---

## 🔒 Security Notes

- ✅ Uses PDO prepared statements (SQL injection safe)
- ✅ Input sanitization on slug parameter
- ✅ Errors logged, not exposed to users
- ⚠️ Keep `config.php` credentials secure
- ⚠️ Consider adding rate limiting for production

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 Error | Check `config.php` credentials |
| Empty response | Verify database has data, check `is_published = 1` |
| CORS error | Already handled in PHP, check browser console |
| 404 on API | Ensure file is in `/public_html/api/` |

---

## 📞 API Reference

### GET /api/get_articles.php

Returns all published articles.

**Response:**
```json
{
    "success": true,
    "count": 6,
    "data": [
        {
            "id": 1,
            "slug": "panduan-izin-ppiu-2024",
            "title": "Panduan Lengkap...",
            "category": "Perizinan",
            "image_url": "https://...",
            "formatted_date": "20 Jan 2024"
        }
    ]
}
```

### GET /api/get_articles.php?slug=xxx

Returns single article with full content.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "slug": "panduan-izin-ppiu-2024",
        "title": "Panduan Lengkap...",
        "content": "<p>Full HTML content...</p>",
        "relatedArticles": [...]
    }
}
```

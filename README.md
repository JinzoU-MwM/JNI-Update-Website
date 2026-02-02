# JNI Consultant Website & Admin System

A professional corporate website developed for **Jaminan Nasional Indonesia (JNI Consultant)**, a leading business licensing and legal consultant in Indonesia. This project includes a modern, responsive public-facing website and a secure backend Admin Dashboard for content management.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20PHP%20%7C%20MySQL-blue)

## 🌐 Project Overview

The website serves as the primary digital touchpoint for JNI Consultant, allowing clients to explore services (PPIU, SBU, Bank Garansi, etc.), read articles, and contact the firm. The integrated Admin Dashboard allows internal staff to manage articles, monitor visitor traffic, view analytics, and manage client testimonials.

### Key Features

#### 🖥️ Public Website (Frontend)
*   **Modern Responsive Design**: Built with semantic HTML5, modular CSS3, and Vanilla JavaScript.
*   **Dynamic Components**: Reusable Navbar and Footer components.
*   **Service Filtering**: Interactive Services page with "Pill" tabs and smooth filtering animations.
*   **Testimonials Section**: Dynamic client reviews loaded via API with star rating rendering.
*   **Visitor Tracking**: Real-time "Spy" system that logs visitor activity (IP, page views, device).
*   **Performant**: Optimized assets and clean code structure.

#### 🔒 Admin Dashboard (Backend)
*   **Secure Authentication**: Session-based login for administrators.
*   **Article Management**: CRUD system for creating and publishing SEO-friendly articles.
*   **Analytics Suite**: Visual charts (Chart.js) showing visitor trends, top pages, and device usage.
*   **Testimonial Manager**: Full control to add, delete, or hide client testimonials.
*   **Activity Logs**: Audit trail of all admin actions for security.

## 📂 Project Structure

```
/
├── admin/                  # Admin Dashboard files
│   ├── auth.php            # Login handler
│   ├── dashboard.html      # Main dashboard UI
│   ├── admin_api.php       # Core API for dashboard
│   ├── admin_testimonials.php # API for testimonials
│   └── *.sql               # Database schemas
├── api/                    # Backend API Endpoints
│   ├── config.php          # Database configuration
│   ├── get_testimonials.php # Public API for reviews
│   ├── tracker.php         # Visitor tracking script
│   └── db_test.php         # Connection diagnostics
├── assets/                 # Static Resources
│   ├── css/                # Modular CSS files
│   ├── js/                 # JavaScript modules
│   └── images/             # Image assets
├── index.html              # Homepage
├── services.html           # Services Listing
└── ...                     # Other HTML pages
```

## 🚀 Installation & Setup

This project requires a standard **LAMP/LEMP** stack (Linux, Apache/Nginx, MySQL, PHP).

### 1. Database Setup
1.  Create a MySQL database on your server (e.g., Hostinger).
2.  Import the SQL schemas in this order via phpMyAdmin:
    *   `api/database.sql` (Core tables: articles)
    *   `admin/admin_schema.sql` (Admin tables: users, logs)
    *   `admin/testimonials_schema.sql` (Testimonials table)
    *   `api/visitor_logs.sql` (Visitor tracking table - *create if not in admin_schema*)
3.  **Default Admin Credentials**:
    *   Username: `admin`
    *   Password: `Berhasil_123` (Change immediately after login!)

### 2. Configuration
1.  Open `api/config.php`.
2.  Update the database credentials to match your server environment:
    ```php
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'your_db_name');
    define('DB_USER', 'your_db_user');
    define('DB_PASS', 'your_db_password');
    ```

### 3. Deployment
1.  Upload all files to your `public_html` directory.
2.  Ensure the `uploads/` folder is writable (chmod 755 or 777).

## 🛠️ Development

*   **CSS Architecture**: Styles are broken down into `components/`, `sections/`, and `utilities/`. Edit these files individually; `style.css` imports them.
*   **JavaScript**: Functional logic is modularized in `assets/js/modules/`.

## 📝 License

&copy; 2024-2026 Jaminan Nasional Indonesia. All Rights Reserved.
Proprietary software developed for internal use.

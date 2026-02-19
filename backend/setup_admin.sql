-- =====================================================
-- JNI Admin Setup - Run this in Supabase SQL Editor
-- =====================================================
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

-- 1. Create admin_users table if not exists
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Create policy to allow service role to bypass RLS (Supabase does this automatically)
-- But we need to ensure the service key can access the table

-- 5. Delete existing admin user (if any)
DELETE FROM admin_users WHERE email = 'admin@jni.com';

-- 6. Insert admin user with password: Admin@123
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@jni.com',
  '$2b$10$brFXjhimIKIgGVIHJ.NjQO7/Q.E9/OsxgypTmm58qaFdXCMtHVet.',
  'Admin User',
  'super_admin',
  true
);

-- 7. Verify the user was created
SELECT 'Admin user created!' as status, email, name, role, is_active, created_at
FROM admin_users WHERE email = 'admin@jni.com';

-- =====================================================
-- Login Credentials:
-- Email: admin@jni.com
-- Password: Admin@123
-- =====================================================

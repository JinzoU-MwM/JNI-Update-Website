-- Completely reset admin user with a known working password

-- First, delete any existing admin user
DELETE FROM admin_users WHERE email = 'admin@jni.com';

-- Create a fresh admin user with password: admin123
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@jni.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye1IjZAgcfl7pQldWq1', -- bcrypt hash for "admin123"
  'Admin User',
  'admin',
  true
);

-- Verify the user was created
SELECT 'Admin user created successfully!' as status, email, name, role, is_active
FROM admin_users WHERE email = 'admin@jni.com';

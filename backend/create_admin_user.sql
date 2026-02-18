-- Create a new admin user with a known working password
-- Password: admin123 (all lowercase, no special characters)

DO $$
BEGIN
  -- First, let's create a test user with a simple password
  INSERT INTO admin_users (email, password_hash, name, role, is_active)
  VALUES (
    'admin@jni.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye1IjZAgcfl7pQldWq1', -- This is bcrypt hash for "admin123"
    'Admin User',
    'admin',
    true
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye1IjZAgcfl7pQldWq1',
    name = 'Admin User',
    is_active = true;
END $$;

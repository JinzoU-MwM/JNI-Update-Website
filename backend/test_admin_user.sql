-- Test query to check if admin user exists and show password hash
SELECT
  id,
  email,
  name,
  role,
  is_active,
  created_at,
  substring(password_hash, 1, 20) || '...' as password_preview
FROM admin_users
WHERE email = 'admin@jni.com';

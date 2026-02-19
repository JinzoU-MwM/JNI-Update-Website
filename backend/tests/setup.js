// Test setup - runs before all tests
// Set environment variables before modules are imported

process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173';
process.env.LOG_LEVEL = 'error';

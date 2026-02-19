/**
 * JNI Backend API Entry Point
 * Express.js + Supabase for Jamnasindo website
 */
try {
  require('dotenv').config();
} catch (e) {
  /* ignore */
}

const express = require('express');
const { applySecurityMiddleware } = require('../src/config/security');
const { registerRoutes, loadErrors } = require('../src/routes/register');
const { errorHandler, notFound } = require('../src/middleware/errorHandler');
const logger = require('../src/config/logger');

// Validate critical environment variables
const initErrors = [];
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    const msg = `FATAL: ${envVar} environment variable is not set`;
    console.error(msg);
    if (process.env.NODE_ENV === 'production') {
      initErrors.push(msg);
    }
  }
}

// Check database connection
let dbReady = false;
try {
  const db = require('../src/config/db');
  dbReady = db !== null;
} catch (e) {
  initErrors.push('db: ' + e.message);
}

// Combine all errors
const allErrors = [...initErrors, ...loadErrors];

// Create Express app
const app = express();

// Apply security middleware (helmet, cors)
applySecurityMiddleware(app);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Register all routes
registerRoutes(app, dbReady);

// Handle 404 and errors
app.get('*', notFound);
app.use(errorHandler);

// Start server in development mode only
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (allErrors.length > 0) {
      console.warn('⚠️  Warnings:', allErrors.join(', '));
    }
  });
}

module.exports = app;

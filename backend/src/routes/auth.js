const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const supabase = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const { JWT_SECRET, ensureJwtSecret } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Strict rate limiter for login - prevents brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/auth/login - Admin login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    ensureJwtSecret();
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    // Find admin user
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();


    if (error || !admin) {
      logger.warn('Login attempt with invalid email:', { email });
      throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password:', { email });
      throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('Admin login successful', { email: admin.email, userId: admin.id });

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify - Verify token
router.post('/verify', (req, res, next) => {
  try {
    ensureJwtSecret();
    const { token } = req.body;

    if (!token) {
      throw new AppError('Token is required', 400, 'VALIDATION_ERROR');
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

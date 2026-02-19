const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for contact form submissions
 * Limits: 10 requests per 15 minutes
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many contact requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for authentication endpoints
 * Limits: 5 requests per 15 minutes (successful requests don't count)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many login attempts, please try again in 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General rate limiter for API endpoints
 * Limits: 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  contactLimiter,
  authLimiter,
  generalLimiter,
};

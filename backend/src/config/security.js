const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

/**
 * Helmet security configuration
 */
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
};

/**
 * CORS configuration
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'https://jni-consultant.vercel.app'];

const corsConfig = {
  origin: (origin, callback) => {
    const isDev = process.env.NODE_ENV !== 'production';

    // In development, allow requests without origin (Postman, curl) or from any localhost
    if (isDev && (!origin || origin.includes('localhost'))) {
      return callback(null, true);
    }

    // In production, strict origin check
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from:', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 600,
};

/**
 * Apply security middleware to Express app
 * @param {import('express').Application} app
 */
function applySecurityMiddleware(app) {
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
}

module.exports = {
  applySecurityMiddleware,
  helmetConfig,
  corsConfig,
  allowedOrigins,
};

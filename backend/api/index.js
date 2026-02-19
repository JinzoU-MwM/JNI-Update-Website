const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
try { require('dotenv').config(); } catch (e) { /* ignore */ }

const initErrors = [];

// Critical env validation - fail fast in production
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

// DB
let dbReady = false;
try { const s = require('../src/config/db'); dbReady = s !== null; } catch (e) { initErrors.push('db: ' + e.message); }

// All 6 routes
let svc, test, cli, art, gal, con;
let auth, testRoute, adminSvc, adminArt, adminTest;
try { svc = require('../src/routes/services'); } catch (e) { initErrors.push('svc: ' + e.message); }
try { test = require('../src/routes/testimonials'); } catch (e) { initErrors.push('test: ' + e.message); }
try { cli = require('../src/routes/clients'); } catch (e) { initErrors.push('cli: ' + e.message); }
try { art = require('../src/routes/articles'); } catch (e) { initErrors.push('art: ' + e.message); }
try { gal = require('../src/routes/gallery'); } catch (e) { initErrors.push('gal: ' + e.message); }
try { con = require('../src/routes/contact'); } catch (e) { initErrors.push('con: ' + e.message); }
try { auth = require('../src/routes/auth'); } catch (e) { initErrors.push('auth: ' + e.message); }
try { testRoute = require('../src/routes/test'); } catch (e) { initErrors.push('test: ' + e.message); }
try { adminSvc = require('../src/routes/admin/services'); } catch (e) { initErrors.push('adminSvc: ' + e.message); }
try { adminArt = require('../src/routes/admin/articles'); } catch (e) { initErrors.push('adminArt: ' + e.message); }
try { adminTest = require('../src/routes/admin/testimonials'); } catch (e) { initErrors.push('adminTest: ' + e.message); }

const { errorHandler, notFound } = require('../src/middleware/errorHandler');
const logger = require('../src/config/logger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// CORS - Strict origin validation for security
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'https://jni-consultant.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
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
  maxAge: 600
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Rate limiters
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many contact requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/api');
});

app.get('/api', (req, res) => {
    res.json({ ok: true, dbReady, initErrors, node: process.version });
});

if (svc) app.use('/api/services', generalLimiter, svc);
if (test) app.use('/api/testimonials', generalLimiter, test);
if (cli) app.use('/api/clients', generalLimiter, cli);
if (art) app.use('/api/articles', generalLimiter, art);
if (gal) app.use('/api/gallery', generalLimiter, gal);
if (con) app.use('/api/contact', contactLimiter, con);

// Admin routes
if (auth) app.use('/api/auth', generalLimiter, auth);
if (testRoute) app.use('/api/test', generalLimiter, testRoute);
if (adminSvc) app.use('/api/admin/services', generalLimiter, adminSvc);
if (adminArt) app.use('/api/admin/articles', generalLimiter, adminArt);
if (adminTest) app.use('/api/admin/testimonials', generalLimiter, adminTest);

app.get('*', notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Running'));
}

module.exports = app;

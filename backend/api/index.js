const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
try { require('dotenv').config(); } catch (e) { /* ignore */ }

const initErrors = [];

// DB
let dbReady = false;
try { const s = require('../src/config/db'); dbReady = s !== null; } catch (e) { initErrors.push('db: ' + e.message); }

// All 6 routes
let svc, test, cli, art, gal, con;
let auth, adminSvc, adminArt, adminTest;
try { svc = require('../src/routes/services'); } catch (e) { initErrors.push('svc: ' + e.message); }
try { test = require('../src/routes/testimonials'); } catch (e) { initErrors.push('test: ' + e.message); }
try { cli = require('../src/routes/clients'); } catch (e) { initErrors.push('cli: ' + e.message); }
try { art = require('../src/routes/articles'); } catch (e) { initErrors.push('art: ' + e.message); }
try { gal = require('../src/routes/gallery'); } catch (e) { initErrors.push('gal: ' + e.message); }
try { con = require('../src/routes/contact'); } catch (e) { initErrors.push('con: ' + e.message); }
try { auth = require('../src/routes/auth'); } catch (e) { initErrors.push('auth: ' + e.message); }
try { adminSvc = require('../src/routes/admin/services'); } catch (e) { initErrors.push('adminSvc: ' + e.message); }
try { adminArt = require('../src/routes/admin/articles'); } catch (e) { initErrors.push('adminArt: ' + e.message); }
try { adminTest = require('../src/routes/admin/testimonials'); } catch (e) { initErrors.push('adminTest: ' + e.message); }

const { errorHandler, notFound } = require('../src/middleware/errorHandler');
const logger = require('../src/config/logger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS - Restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'https://jni-consultant.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
if (adminSvc) app.use('/api/admin/services', generalLimiter, adminSvc);
if (adminArt) app.use('/api/admin/articles', generalLimiter, adminArt);
if (adminTest) app.use('/api/admin/testimonials', generalLimiter, adminTest);

app.get('*', notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Running'));
}

module.exports = app;

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Supabase client (validates env vars on import)
require('../src/config/db');

// Import routes
const servicesRoute = require('../src/routes/services');
const testimonialsRoute = require('../src/routes/testimonials');
const clientsRoute = require('../src/routes/clients');
const articlesRoute = require('../src/routes/articles');
const galleryRoute = require('../src/routes/gallery');
const contactRoute = require('../src/routes/contact');

const app = express();

// === MIDDLEWARE ===

// CORS — allow frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 requests per window
    message: { error: 'Too many requests, please try again later.' }
});

// === ROUTES ===
app.get('/api', (req, res) => {
    res.json({
        message: 'JNI Consultant API',
        version: '1.0.0',
        database: 'Supabase (PostgreSQL)',
        endpoints: [
            'GET /api/services',
            'GET /api/services/:slug',
            'GET /api/testimonials',
            'GET /api/clients',
            'GET /api/articles',
            'GET /api/articles/:slug',
            'GET /api/gallery',
            'POST /api/contact',
        ]
    });
});

app.use('/api/services', servicesRoute);
app.use('/api/testimonials', testimonialsRoute);
app.use('/api/clients', clientsRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/gallery', galleryRoute);
app.use('/api/contact', contactLimiter, contactRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server (local dev only — Vercel uses serverless)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 API running at http://localhost:${PORT}/api`);
    });
}

// Export for Vercel serverless
module.exports = app;

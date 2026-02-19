const { generalLimiter, contactLimiter } = require('../middleware/rateLimiters');

/**
 * Route modules - loaded with error handling
 */
let services, testimonials, clients, articles, gallery, contact;
let auth, testRoute;
let adminServices, adminArticles, adminTestimonials;

const loadErrors = [];

// Load public routes
try {
  services = require('../routes/services');
} catch (e) {
  loadErrors.push('services: ' + e.message);
}
try {
  testimonials = require('../routes/testimonials');
} catch (e) {
  loadErrors.push('testimonials: ' + e.message);
}
try {
  clients = require('../routes/clients');
} catch (e) {
  loadErrors.push('clients: ' + e.message);
}
try {
  articles = require('../routes/articles');
} catch (e) {
  loadErrors.push('articles: ' + e.message);
}
try {
  gallery = require('../routes/gallery');
} catch (e) {
  loadErrors.push('gallery: ' + e.message);
}
try {
  contact = require('../routes/contact');
} catch (e) {
  loadErrors.push('contact: ' + e.message);
}

// Load auth routes
try {
  auth = require('../routes/auth');
} catch (e) {
  loadErrors.push('auth: ' + e.message);
}

// Load test routes
try {
  testRoute = require('../routes/test');
} catch (e) {
  loadErrors.push('test: ' + e.message);
}

// Load admin routes
try {
  adminServices = require('../routes/admin/services');
} catch (e) {
  loadErrors.push('adminServices: ' + e.message);
}
try {
  adminArticles = require('../routes/admin/articles');
} catch (e) {
  loadErrors.push('adminArticles: ' + e.message);
}
try {
  adminTestimonials = require('../routes/admin/testimonials');
} catch (e) {
  loadErrors.push('adminTestimonials: ' + e.message);
}

/**
 * Register all routes with the Express app
 * @param {import('express').Application} app
 * @param {boolean} dbReady - Database connection status
 */
function registerRoutes(app, dbReady) {
  // Health check endpoint
  app.get('/', (req, res) => {
    res.redirect('/api');
  });

  app.get('/api', (req, res) => {
    res.json({
      ok: true,
      dbReady,
      loadErrors: loadErrors.length > 0 ? loadErrors : undefined,
      node: process.version,
    });
  });

  // Public routes with rate limiting
  if (services) app.use('/api/services', generalLimiter, services);
  if (testimonials) app.use('/api/testimonials', generalLimiter, testimonials);
  if (clients) app.use('/api/clients', generalLimiter, clients);
  if (articles) app.use('/api/articles', generalLimiter, articles);
  if (gallery) app.use('/api/gallery', generalLimiter, gallery);
  if (contact) app.use('/api/contact', contactLimiter, contact);

  // Auth routes
  if (auth) app.use('/api/auth', generalLimiter, auth);

  // Test routes
  if (testRoute) app.use('/api/test', generalLimiter, testRoute);

  // Admin routes
  if (adminServices) app.use('/api/admin/services', generalLimiter, adminServices);
  if (adminArticles) app.use('/api/admin/articles', generalLimiter, adminArticles);
  if (adminTestimonials) app.use('/api/admin/testimonials', generalLimiter, adminTestimonials);
}

module.exports = {
  registerRoutes,
  loadErrors,
};

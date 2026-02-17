const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
try { require('dotenv').config(); } catch (e) { /* ignore */ }

const initErrors = [];

// DB
let dbReady = false;
try { const s = require('../src/config/db'); dbReady = s !== null; } catch (e) { initErrors.push('db: ' + e.message); }

// All 6 routes
let svc, test, cli, art, gal, con;
try { svc = require('../src/routes/services'); } catch (e) { initErrors.push('svc: ' + e.message); }
try { test = require('../src/routes/testimonials'); } catch (e) { initErrors.push('test: ' + e.message); }
try { cli = require('../src/routes/clients'); } catch (e) { initErrors.push('cli: ' + e.message); }
try { art = require('../src/routes/articles'); } catch (e) { initErrors.push('art: ' + e.message); }
try { gal = require('../src/routes/gallery'); } catch (e) { initErrors.push('gal: ' + e.message); }
try { con = require('../src/routes/contact'); } catch (e) { initErrors.push('con: ' + e.message); }

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many requests' } });

app.get('/api', (req, res) => {
    res.json({ ok: true, dbReady, initErrors, node: process.version });
});

if (svc) app.use('/api/services', svc);
if (test) app.use('/api/testimonials', test);
if (cli) app.use('/api/clients', cli);
if (art) app.use('/api/articles', art);
if (gal) app.use('/api/gallery', gal);
if (con) app.use('/api/contact', contactLimiter, con);

app.use(function notFound(req, res) { res.status(404).json({ error: 'Not found' }); });
app.use(function errorHandler(err, req, res, _next) { res.status(500).json({ error: 'Server error' }); });

if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Running'));
}

module.exports = app;

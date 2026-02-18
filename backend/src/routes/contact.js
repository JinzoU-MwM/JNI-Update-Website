const express = require('express');
const supabase = require('../config/db');
const { validate, contactSchema, sanitizeHtml } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

// POST /api/contact — Submit contact form
router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, phone, service_type, message } = req.validated;

    const { error } = await supabase
      .from('messages')
      .insert({
        name: sanitizeHtml(name.trim()),
        email: sanitizeHtml(email?.trim()),
        phone: sanitizeHtml(phone?.trim()),
        service_type: sanitizeHtml(service_type?.trim()),
        message: sanitizeHtml(message.trim()),
        source: 'contact_form',
      });

    if (error) {
      logger.error('Supabase insert error:', error);
      throw new AppError('Failed to save message', 500, 'DATABASE_ERROR');
    }

    logger.info('Contact form submitted', { name, email });

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

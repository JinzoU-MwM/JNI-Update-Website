const express = require('express');
const supabase = require('../config/db');
const { validate, contactSchema, sanitizeHtml } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { sendContactNotification, sendAutoReply } = require('../services/email');

const router = express.Router();

// POST /api/contact — Submit contact form
router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, phone, service_type, message } = req.validated;

    const sanitizedData = {
      name: sanitizeHtml(name.trim()),
      email: sanitizeHtml(email?.trim()),
      phone: sanitizeHtml(phone?.trim()),
      service_type: sanitizeHtml(service_type?.trim()),
      message: sanitizeHtml(message.trim()),
      source: 'contact_form',
    };

    // Save to database
    const { error } = await supabase
      .from('messages')
      .insert(sanitizedData);

    if (error) {
      logger.error('Supabase insert error:', error);
      throw new AppError('Failed to save message', 500, 'DATABASE_ERROR');
    }

    logger.info('Contact form submitted', { name, email });

    // Send email notifications (async, don't block response)
    setImmediate(async () => {
      try {
        // Notify admin
        await sendContactNotification(sanitizedData);

        // Send auto-reply to user
        if (email) {
          await sendAutoReply(sanitizedData);
        }
      } catch (emailError) {
        logger.error('Email notification error:', emailError);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

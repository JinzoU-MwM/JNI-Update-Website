const { z } = require('zod');
const logger = require('../config/logger');

const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      ...req.body,
      ...req.params,
      ...req.query
    });
    req.validated = validatedData;
    next();
  } catch (error) {
    logger.error('Validation error:', error.errors);
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: error.errors
    });
  }
};

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  service_type: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

const paginationSchema = z.object({
  page: z.string().transform(val => Math.max(1, parseInt(val) || 1)),
  limit: z.string().transform(val => Math.min(100, Math.max(1, parseInt(val) || 12))),
  category: z.string().optional()
});

const slugSchema = z.object({
  slug: z.string().min(1).max(255)
});

const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

module.exports = { validate, contactSchema, paginationSchema, slugSchema, sanitizeHtml };

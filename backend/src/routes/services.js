const express = require('express');
const supabase = require('../config/db');
const { validate, slugSchema, sanitizeHtml } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { getStorageUrl } = require('../utils/storage');

const router = express.Router();

// GET /api/services — List active services
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const services = data.map(service => ({
      ...service,
      image_url: getStorageUrl(service.image_url),
      icon_svg: service.icon_svg
    }));

    logger.info('Services fetched', { count: services.length });

    res.json(services);
  } catch (error) {
    next(error);
  }
});

// GET /api/services/:slug — Single service
router.get('/:slug', validate(slugSchema), async (req, res, next) => {
  try {
    const { slug } = req.validated;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      throw new AppError('Service not found', 404, 'NOT_FOUND');
    }

    const service = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    logger.info('Service fetched', { slug });

    res.json(service);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const supabase = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { getStorageUrl } = require('../utils/storage');

const router = express.Router();

// GET /api/testimonials — List active testimonials
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const testimonials = data.map(item => ({
      ...item,
      photo_url: getStorageUrl(item.photo_url)
    }));

    logger.info('Testimonials fetched', { count: testimonials.length });

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const { getStorageUrl } = require('../../utils/storage');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// GET /api/admin/testimonials - Get all testimonials
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const testimonials = data.map(item => ({
      ...item,
      photo_url: getStorageUrl(item.photo_url)
    }));

    logger.info('Admin: Testimonials fetched', { count: testimonials.length });

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/testimonials/:id - Get single testimonial
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      throw new AppError('Testimonial not found', 404, 'NOT_FOUND');
    }

    const testimonial = {
      ...data,
      photo_url: getStorageUrl(data.photo_url)
    };

    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/testimonials - Create new testimonial
router.post('/', async (req, res, next) => {
  try {
    const testimonialData = req.body;

    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single();

    if (error) throw error;

    logger.info('Admin: Testimonial created', { testimonialId: data.id });

    const testimonial = {
      ...data,
      photo_url: getStorageUrl(data.photo_url)
    };

    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/testimonials/:id - Update testimonial
router.put('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Testimonial not found or update failed', 404, 'NOT_FOUND');
    }

    logger.info('Admin: Testimonial updated', { testimonialId: data.id });

    const testimonial = {
      ...data,
      photo_url: getStorageUrl(data.photo_url)
    };

    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    logger.info('Admin: Testimonial deleted', { testimonialId: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

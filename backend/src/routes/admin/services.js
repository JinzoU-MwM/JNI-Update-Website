const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const { getStorageUrl } = require('../../utils/storage');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// GET /api/admin/services - Get all services (including inactive)
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const services = data.map(service => ({
      ...service,
      image_url: getStorageUrl(service.image_url)
    }));

    logger.info('Admin: Services fetched', { count: services.length });

    res.json(services);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/services/:id - Get single service
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      throw new AppError('Service not found', 404, 'NOT_FOUND');
    }

    const service = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.json(service);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/services - Create new service
router.post('/', async (req, res, next) => {
  try {
    const serviceData = req.body;

    const { data, error } = await supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;

    logger.info('Admin: Service created', { serviceId: data.id });

    const service = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/services/:id - Update service
router.put('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Service not found or update failed', 404, 'NOT_FOUND');
    }

    logger.info('Admin: Service updated', { serviceId: data.id });

    const service = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.json(service);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/services/:id - Delete service
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    logger.info('Admin: Service deleted', { serviceId: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

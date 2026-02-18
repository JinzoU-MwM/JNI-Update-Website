const express = require('express');
const supabase = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { getStorageUrl } = require('../utils/storage');

const router = express.Router();

// GET /api/clients — List active client logos
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const clients = data.map(client => ({
      ...client,
      logo_path: getStorageUrl(client.logo_path)
    }));

    logger.info('Clients fetched', { count: clients.length });

    res.json(clients);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

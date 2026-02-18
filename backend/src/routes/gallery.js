const express = require('express');
const supabase = require('../config/db');
const { sanitizeHtml } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { getStorageUrl } = require('../utils/storage');

const router = express.Router();

// GET /api/gallery — List gallery items
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;

    const { data: allItems, error: countError } = await supabase
      .from('gallery')
      .select('category, *')
      .order('created_at', { ascending: false });

    if (countError) throw countError;

    let items = allItems;

    if (category && category !== 'all') {
      const sanitizedCategory = sanitizeHtml(category);
      items = items.filter(item => item.category === sanitizedCategory);
    }

    const galleryItems = items.map(item => ({
      ...item,
      image_url: getStorageUrl(item.image_url)
    }));

    const categories = ['all', ...new Set(allItems?.map(item => item.category) || [])];

    logger.info('Gallery fetched', { category, itemCount: galleryItems.length, categoryCount: categories.length });

    res.json({
      items: galleryItems,
      categories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

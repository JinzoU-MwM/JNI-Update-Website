const express = require('express');
const supabase = require('../config/db');
const { validate, paginationSchema, slugSchema, sanitizeHtml } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const { getStorageUrl } = require('../utils/storage');

const router = express.Router();

// GET /api/articles — List published articles
router.get('/', validate(paginationSchema), async (req, res, next) => {
  try {
    const { page, limit, category } = req.validated;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('articles')
      .select('id, slug, title, category, author, image_url, excerpt, read_time, created_at', { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      const sanitizedCategory = sanitizeHtml(category);
      query = query.eq('category', sanitizedCategory);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const articles = data.map(article => ({
      ...article,
      image_url: getStorageUrl(article.image_url)
    }));

    logger.info('Articles fetched', { page, limit, category, count });

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/articles/:slug — Single article
router.get('/:slug', validate(slugSchema), async (req, res, next) => {
  try {
    const { slug } = req.validated;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    const article = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    logger.info('Article fetched', { slug });

    res.json(article);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

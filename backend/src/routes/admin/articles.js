const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const { getStorageUrl } = require('../../utils/storage');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// GET /api/admin/articles - Get all articles
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const articles = data.map(article => ({
      ...article,
      image_url: getStorageUrl(article.image_url)
    }));

    logger.info('Admin: Articles fetched', { page, limit, count });

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

// GET /api/admin/articles/:id - Get single article
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    const article = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/articles - Create new article
router.post('/', async (req, res, next) => {
  try {
    const articleData = req.body;

    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) throw error;

    logger.info('Admin: Article created', { articleId: data.id });

    const article = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/articles/:id - Update article
router.put('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Article not found or update failed', 404, 'NOT_FOUND');
    }

    logger.info('Admin: Article updated', { articleId: data.id });

    const article = {
      ...data,
      image_url: getStorageUrl(data.image_url)
    };

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/articles/:id - Delete article
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    logger.info('Admin: Article deleted', { articleId: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const { getStorageUrl } = require('../../utils/storage');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// GET /api/admin/gallery - Get all gallery items
router.get('/', async (req, res, next) => {
    try {
        if (!supabase) {
            throw new AppError('Database not connected', 503, 'DB_ERROR');
        }

        let query = supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (req.query.category && req.query.category !== 'all') {
            query = query.eq('category', req.query.category);
        }

        const { data: items, error } = await query;

        if (error) throw error;

        const galleryItems = (items || []).map(item => ({
            ...item,
            image_url: getStorageUrl(item.image_url)
        }));

        // Get unique categories
        const { data: allItems } = await supabase
            .from('gallery')
            .select('category');

        const categories = ['all', ...new Set((allItems || []).map(item => item.category).filter(Boolean))];

        logger.info('Admin: Gallery fetched', { count: galleryItems.length });

        res.json({
            items: galleryItems,
            categories
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/gallery/:id - Get single gallery item
router.get('/:id', async (req, res, next) => {
    try {
        if (!supabase) {
            throw new AppError('Database not connected', 503, 'DB_ERROR');
        }

        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !data) {
            throw new AppError('Gallery item not found', 404, 'NOT_FOUND');
        }

        const item = {
            ...data,
            image_url: getStorageUrl(data.image_url)
        };

        res.json(item);
    } catch (error) {
        next(error);
    }
});

// POST /api/admin/gallery - Create new gallery item
router.post('/', async (req, res, next) => {
    try {
        if (!supabase) {
            throw new AppError('Database not connected', 503, 'DB_ERROR');
        }

        const galleryData = req.body;

        const { data, error } = await supabase
            .from('gallery')
            .insert(galleryData)
            .select()
            .single();

        if (error) throw error;

        logger.info('Admin: Gallery item created', { galleryId: data.id });

        const item = {
            ...data,
            image_url: getStorageUrl(data.image_url)
        };

        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/gallery/:id - Delete gallery item
router.delete('/:id', async (req, res, next) => {
    try {
        if (!supabase) {
            throw new AppError('Database not connected', 503, 'DB_ERROR');
        }

        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        logger.info('Admin: Gallery item deleted', { galleryId: req.params.id });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;

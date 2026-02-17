const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// GET /api/articles — List published articles
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('articles')
            .select('id, slug, title, category, author, image_url, excerpt, read_time, created_at', { count: 'exact' })
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (req.query.category) {
            query = query.eq('category', req.query.category);
        }

        const { data, error, count } = await query;
        if (error) throw error;

        res.json({
            articles: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        });
    } catch (error) {
        console.error('Articles error:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// GET /api/articles/:slug — Single article
router.get('/:slug', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', req.params.slug)
            .eq('is_published', true)
            .single();

        if (error || !data) return res.status(404).json({ error: 'Article not found' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

module.exports = router;

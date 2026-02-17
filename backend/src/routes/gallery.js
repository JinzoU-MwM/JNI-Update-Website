const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// GET /api/gallery — List gallery items
router.get('/', async (req, res) => {
    try {
        let query = supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (req.query.category && req.query.category !== 'all') {
            query = query.eq('category', req.query.category);
        }

        const { data: items, error } = await query;
        if (error) throw error;

        // Get unique categories
        const { data: catData } = await supabase
            .from('gallery')
            .select('category')
            .order('category');

        const categories = [...new Set((catData || []).map(c => c.category))];

        res.json({ items, categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

module.exports = router;

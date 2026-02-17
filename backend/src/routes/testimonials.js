const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// GET /api/testimonials — List active testimonials
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

module.exports = router;

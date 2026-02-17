const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// GET /api/services — List active services
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Services error:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// GET /api/services/:slug — Single service
router.get('/:slug', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('slug', req.params.slug)
            .single();

        if (error || !data) return res.status(404).json({ error: 'Service not found' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});

module.exports = router;

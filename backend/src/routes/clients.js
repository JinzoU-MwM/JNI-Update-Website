const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// GET /api/clients — List active client logos
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

module.exports = router;

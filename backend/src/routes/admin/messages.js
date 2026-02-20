const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin message routes
router.use(authMiddleware);

// GET /api/admin/messages — Fetch all contact messages
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        logger.info('Admin: Messages fetched', { count: data.length });

        res.json(data);
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/messages/:id — Fetch single message
router.get('/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Message not found' });
        }

        res.json(data);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/messages/:id — Delete a message
router.delete('/:id', async (req, res, next) => {
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        logger.info('Admin: Message deleted', { id: req.params.id });

        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

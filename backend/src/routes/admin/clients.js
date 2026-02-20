const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const { getStorageUrl } = require('../../utils/storage');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// GET /api/admin/clients - Get all clients
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;

        const clients = data.map(client => ({
            ...client,
            logo_path: getStorageUrl(client.logo_path)
        }));

        logger.info('Admin: Clients fetched', { count: clients.length });

        res.json(clients);
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/clients/:id - Get single client
router.get('/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !data) {
            throw new AppError('Client not found', 404, 'NOT_FOUND');
        }

        const client = {
            ...data,
            logo_path: getStorageUrl(data.logo_path)
        };

        res.json(client);
    } catch (error) {
        next(error);
    }
});

// POST /api/admin/clients - Create new client
router.post('/', async (req, res, next) => {
    try {
        const clientData = req.body;

        const { data, error } = await supabase
            .from('clients')
            .insert(clientData)
            .select()
            .single();

        if (error) throw error;

        logger.info('Admin: Client created', { clientId: data.id });

        const client = {
            ...data,
            logo_path: getStorageUrl(data.logo_path)
        };

        res.status(201).json(client);
    } catch (error) {
        next(error);
    }
});

// PUT /api/admin/clients/:id - Update client
router.put('/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !data) {
            throw new AppError('Client not found or update failed', 404, 'NOT_FOUND');
        }

        logger.info('Admin: Client updated', { clientId: data.id });

        const client = {
            ...data,
            logo_path: getStorageUrl(data.logo_path)
        };

        res.json(client);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/clients/:id - Delete client
router.delete('/:id', async (req, res, next) => {
    try {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        logger.info('Admin: Client deleted', { clientId: req.params.id });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;

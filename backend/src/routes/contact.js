const express = require('express');
const supabase = require('../config/db');

const router = express.Router();

// POST /api/contact — Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, serviceType, message, source } = req.body;

        // Basic validation
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                name: name.trim(),
                email: email?.trim() || null,
                phone: phone?.trim() || null,
                service_type: serviceType?.trim() || null,
                message: message.trim(),
                source: source || 'contact_form',
            });

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;

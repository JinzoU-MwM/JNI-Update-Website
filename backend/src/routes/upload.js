const express = require('express');
const supabase = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/admin/upload - Upload image to Supabase Storage
router.post('/', async (req, res, next) => {
    try {
        const { file, folder = 'uploads', filename } = req.body;

        if (!file) {
            throw new AppError('No file provided', 400, 'VALIDATION_ERROR');
        }

        // Extract base64 data and mime type
        const matches = file.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            throw new AppError('Invalid file format. Expected base64 data URL', 400, 'VALIDATION_ERROR');
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        // Validate mime type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(mimeType)) {
            throw new AppError(`Invalid file type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`, 400, 'VALIDATION_ERROR');
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (buffer.length > maxSize) {
            throw new AppError('File too large. Maximum size is 5MB', 400, 'VALIDATION_ERROR');
        }

        // Generate unique filename
        const ext = mimeType.split('/')[1];
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = filename
            ? `${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            : `${timestamp}_${randomStr}.${ext}`;
        const filePath = `${folder}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, buffer, {
                contentType: mimeType,
                upsert: false
            });

        if (error) {
            logger.error('Storage upload error:', error);
            throw new AppError(`Upload failed: ${error.message}`, 500, 'UPLOAD_ERROR');
        }

        logger.info('File uploaded successfully', { path: data.path });

        // Return the storage path (not full URL - getStorageUrl will handle that)
        res.status(201).json({
            success: true,
            path: data.path,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/upload - Delete file from Supabase Storage
router.delete('/', async (req, res, next) => {
    try {
        const { path } = req.body;

        if (!path) {
            throw new AppError('No path provided', 400, 'VALIDATION_ERROR');
        }

        const { error } = await supabase.storage
            .from('images')
            .remove([path]);

        if (error) {
            logger.error('Storage delete error:', error);
            throw new AppError(`Delete failed: ${error.message}`, 500, 'DELETE_ERROR');
        }

        logger.info('File deleted successfully', { path });

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

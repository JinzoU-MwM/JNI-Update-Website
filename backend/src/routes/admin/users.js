const express = require('express');
const supabase = require('../../config/db');
const { authMiddleware } = require('../../middleware/auth');
const { AppError } = require('../../middleware/errorHandler');
const bcrypt = require('bcryptjs');
const logger = require('../../config/logger');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/admin/users - Get all users
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logger.info('Admin: Users fetched', { count: data.length });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users/:id - Get single user
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, is_active, last_login, created_at')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/users - Create new user
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      throw new AppError('Username, email, and password are required', 400, 'VALIDATION_ERROR');
    }

    // Check if username or email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existing) {
      throw new AppError('Username or email already exists', 400, 'DUPLICATE');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        role: role || 'editor',
        is_active: true
      })
      .select('id, username, email, role, is_active, created_at')
      .single();

    if (error) throw error;

    logger.info('Admin: User created', { userId: data.id, username: data.username });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { username, email, password, role, is_active } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof is_active === 'boolean') updateData.is_active = is_active;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No fields to update', 400, 'VALIDATION_ERROR');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.params.id)
      .select('id, username, email, role, is_active, last_login, created_at')
      .single();

    if (error || !data) {
      throw new AppError('User not found or update failed', 404, 'NOT_FOUND');
    }

    logger.info('Admin: User updated', { userId: data.id });

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      throw new AppError('Cannot delete your own account', 400, 'FORBIDDEN');
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    logger.info('Admin: User deleted', { userId: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

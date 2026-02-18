const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Test endpoint for authentication debugging
router.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== Authentication Test ===');
    console.log('Input email:', email);
    console.log('Input password:', password);
    console.log('Password length:', password?.length);

    // Step 1: Check if admin user exists
    console.log('\n--- Step 1: Finding admin user ---');
    const { data: admin, error: findError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email?.toLowerCase())
      .eq('is_active', true)
      .single();

    if (findError) {
      console.log('❌ Find error:', findError);
      return res.status(400).json({
        success: false,
        message: 'Failed to find admin user',
        error: findError.message,
        sqlError: findError
      });
    }

    if (!admin) {
      console.log('❌ No admin user found');
      return res.status(400).json({
        success: false,
        message: 'No active admin user found with this email',
        email: email,
        found: false
      });
    }

    console.log('✅ Admin user found:', {
      email: admin.email,
      name: admin.name,
      role: admin.role,
      is_active: admin.is_active
    });

    // Step 2: Verify password
    console.log('\n--- Step 2: Verifying password ---');
    console.log('Stored hash:', admin.password_hash);
    console.log('Stored hash length:', admin.password_hash?.length);

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    console.log('Password valid:', isValidPassword);

    // Step 3: Generate token
    console.log('\n--- Step 3: Generating token ---');
    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully');

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: admin,
        token: token,
        password_valid: isValidPassword,
        jwt_secret_set: !!JWT_SECRET
      }
    });
  } catch (error) {
    console.error('❌ Test error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint to list all admin users (for debugging)
router.get('/list-admins', async (req, res) => {
  try {
    console.log('=== Listing all admin users ===');

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Error fetching admin users:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch admin users',
        error: error.message
      });
    }

    console.log('✅ Found admin users:', data.length);

    res.json({
      success: true,
      count: data.length,
      users: data.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        password_hash_length: user.password_hash?.length,
        created_at: user.created_at
      }))
    });
  } catch (error) {
    console.error('❌ List error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint to create a new admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    console.log('=== Creating new admin user ===');
    console.log('Email:', email);
    console.log('Password:', password);

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Generated hash:', passwordHash);

    // Create the user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: email?.toLowerCase(),
        password_hash: passwordHash,
        name: name || 'Test Admin',
        role: role || 'admin',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Error creating admin user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create admin user',
        error: error.message
      });
    }

    console.log('✅ Admin user created:', {
      id: data.id,
      email: data.email,
      name: data.name
    });

    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: data
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;

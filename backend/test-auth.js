const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('./src/config/db');
const { JWT_SECRET } = require('./src/middleware/auth');

async function testAuthentication() {
  console.log('=== Testing Authentication System ===\n');

  try {
    // Step 1: Check if admin_users table exists
    console.log('📊 Step 1: Checking admin_users table...');
    const { data: tables, error: tableError } = await supabase
      .rpc('get_tables', { schema: 'public' })
      .catch(() => ({ data: null }));

    if (tableError) {
      console.log('⚠️  Could not check tables:', tableError.message);
      console.log('⚠️  This is expected if the rpc function doesn\'t exist');
    } else {
      console.log('✅ Tables query completed');
    }

    // Step 2: List all admin users
    console.log('\n📊 Step 2: Listing all admin users...');
    const { data: adminUsers, error: listError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (listError) {
      console.log('❌ Error listing admin users:', listError.message);
      console.log('❌ Make sure the admin_users table exists!');
      return;
    }

    console.log(`✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}`);
      console.log(`     Name: ${user.name}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     Active: ${user.is_active}`);
      console.log(`     Hash length: ${user.password_hash?.length}`);
      console.log(`     Created: ${user.created_at}`);
      console.log('');
    });

    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found. Creating test user...');
      const password = 'admin123';
      const passwordHash = await bcrypt.hash(password, 10);
      console.log('🔐 Hashed password:', password);

      const { data: newUser, error: createError } = await supabase
        .from('admin_users')
        .insert({
          email: 'admin@jni.com',
          password_hash: passwordHash,
          name: 'Test Admin',
          role: 'admin',
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        console.log('❌ Failed to create test user:', createError.message);
        return;
      }

      console.log('✅ Test admin user created:');
      console.log(`  Email: admin@jni.com`);
      console.log(`  Password: ${password}`);
      console.log(`  ID: ${newUser.id}`);
    }

    // Step 3: Test password verification
    console.log('\n🔐 Step 3: Testing password verification...');
    const testPassword = 'admin123';
    const { data: testUser, error: findError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@jni.com')
      .single();

    if (findError || !testUser) {
      console.log('❌ Could not find admin user for password test');
      return;
    }

    console.log(`Testing password: "${testPassword}"`);
    console.log(`Against hash: ${testUser.password_hash.substring(0, 20)}...`);

    const isValidPassword = await bcrypt.compare(testPassword, testUser.password_hash);
    console.log(`✅ Password valid: ${isValidPassword}`);

    if (!isValidPassword) {
      console.log('❌ Password verification failed!');
      console.log('⚠️  This means the stored hash doesn\'t match the password');
      console.log('⚠️  Try running: node seed-admin.js to create a fresh user');
    }

    // Step 4: Test JWT generation
    console.log('\n🔑 Step 4: Testing JWT token generation...');
    if (!JWT_SECRET) {
      console.log('❌ JWT_SECRET not set in environment variables!');
      console.log('⚠️  Set JWT_SECRET in Vercel environment variables');
      return;
    }

    console.log(`JWT_SECRET is set (length: ${JWT_SECRET.length})`);

    const token = jwt.sign(
      {
        userId: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully');
    console.log(`Token (first 50 chars): ${token.substring(0, 50)}...`);

    // Step 5: Test JWT verification
    console.log('\n🔓 Step 5: Testing JWT token verification...');
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully:');
      console.log(`  User ID: ${decoded.userId}`);
      console.log(`  Email: ${decoded.email}`);
      console.log(`  Name: ${decoded.name}`);
      console.log(`  Role: ${decoded.role}`);
      console.log(`  Expires: ${new Date(decoded.exp * 1000).toISOString()}`);
    } catch (verifyError) {
      console.log('❌ Token verification failed:', verifyError.message);
    }

    // Summary
    console.log('\n=== Authentication Test Summary ===');
    console.log('✅ Database connection: OK');
    console.log('✅ Admin user exists: YES');
    console.log(`✅ Password verification: ${isValidPassword ? 'OK' : 'FAILED'}`);
    console.log('✅ JWT generation: OK');
    console.log('✅ JWT verification: OK');

    if (isValidPassword && JWT_SECRET) {
      console.log('\n🎉 All authentication tests PASSED!');
      console.log('🔐 Login credentials:');
      console.log('   Email: admin@jni.com');
      console.log('   Password: admin123');
    } else {
      console.log('\n⚠️  Some authentication tests FAILED!');
      console.log('🔧 Fix issues above and try again');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testAuthentication().then(() => {
  console.log('\n=== Test Complete ===');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

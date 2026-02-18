const bcrypt = require('bcryptjs');
const supabase = require('./src/config/db');

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin user seed...');

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', 'admin@jni.com')
      .single();

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      return;
    }

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Hash the password
    const password = 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const { data: admin, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@jni.com',
        password_hash: passwordHash,
        name: 'Admin User',
        role: 'super_admin',
        is_active: true
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin().then(() => {
  console.log('🎉 Seeding completed!');
  process.exit(0);
});

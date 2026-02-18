const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing required Supabase environment variables');
    console.error('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'SET' : 'MISSING');
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
}

module.exports = supabase;




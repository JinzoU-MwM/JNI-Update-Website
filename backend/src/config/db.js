const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '').trim();

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase env vars. URL:', supabaseUrl ? 'SET' : 'MISSING', 'KEY:', supabaseKey ? 'SET' : 'MISSING');
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
}

module.exports = supabase;




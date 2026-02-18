const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_KEY?.trim();

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('❌ Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
}

module.exports = supabase;




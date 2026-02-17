/**
 * Setup script — creates tables in Supabase via the management API
 * Run: node setup-tables.js
 * 
 * NOTE: If this fails due to RLS restrictions, paste supabase_schema.sql
 * directly into Supabase Dashboard → SQL Editor
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function setupTables() {
    console.log('🔧 Setting up Supabase tables...\n');

    const sqlPath = path.join(__dirname, 'supabase_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    let success = 0;
    let failed = 0;

    for (const statement of statements) {
        try {
            const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
            if (error) {
                // Try direct query via rest
                const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': process.env.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
                    },
                    body: JSON.stringify({ query: statement + ';' }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            }
            success++;
        } catch (err) {
            failed++;
            const preview = statement.substring(0, 60).replace(/\n/g, ' ');
            console.log(`⚠️  Skipped: ${preview}...`);
        }
    }

    console.log(`\n✅ ${success} statements executed, ${failed} skipped`);

    if (failed > 0) {
        console.log('\n⚠️  Some statements failed. This is normal if tables already exist.');
        console.log('   If tables don\'t exist yet, paste supabase_schema.sql into:');
        console.log('   Supabase Dashboard → SQL Editor → New Query → Run');
    }
}

setupTables();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lelidbxcqxyvznsweyui.supabase.co';
const supabaseAnonKey = 'sb_publishable_jAqMakTEd7aiv5iSs9ODzA_32Z4Uzvu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const tables = ['restaurants', 'bookings', 'offers', 'profiles'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (data && data.length > 0) {
            console.log(`Table ${table} keys:`, Object.keys(data[0]).join(', '));
        } else {
            console.log(`Table ${table} is empty or not found.`);
        }
    }
}

run();

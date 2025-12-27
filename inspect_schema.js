import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lelidbxcqxyvznsweyui.supabase.co';
const supabaseAnonKey = 'sb_publishable_jAqMakTEd7aiv5iSs9ODzA_32Z4Uzvu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema(tableName) {
    console.log(`Checking schema for: ${tableName}`);
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

    if (error) {
        console.log("Error:", error.message);
    } else if (data && data.length > 0) {
        console.log("KEYS:", Object.keys(data[0]).join(", "));
    } else {
        console.log("No data found in table to inspect.");
    }
}

const table = process.argv[2] || 'profiles';
checkSchema(table);

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://lelidbxcqxyvznsweyui.supabase.co';
const supabaseAnonKey = 'sb_publishable_jAqMakTEd7aiv5iSs9ODzA_32Z4Uzvu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('email, role, username')
        .order('role');

    if (error) {
        fs.writeFileSync('users_list.txt', "Error: " + error.message);
        return;
    }

    if (data && data.length > 0) {
        let output = "ROLE                 | USERNAME                       | EMAIL\n";
        output += "---------------------|--------------------------------|-------------------------\n";
        data.forEach(user => {
            output += `${(user.role || 'N/A').padEnd(21)}| ${(user.username || 'N/A').padEnd(31)}| ${user.email}\n`;
        });
        fs.writeFileSync('users_list.txt', output);
        console.log("List saved to users_list.txt");
    } else {
        fs.writeFileSync('users_list.txt', "No profiles found.");
    }
}

listAllUsers();

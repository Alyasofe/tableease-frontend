import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lelidbxcqxyvznsweyui.supabase.co';
const supabaseAnonKey = 'sb_publishable_jAqMakTEd7aiv5iSs9ODzA_32Z4Uzvu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testToggle(userId, restaurantId) {
    console.log(`Testing toggle for User: ${userId}, Restaurant: ${restaurantId}`);

    // Check current favorites
    const { data: current, error: fetchError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId);

    if (fetchError) {
        console.log("Fetch Error:", fetchError.message);
        return;
    }

    if (current.length > 0) {
        console.log("Currently a favorite. Deleting...");
        const { error: delError } = await supabase
            .from('user_favorites')
            .delete()
            .match({ user_id: userId, restaurant_id: restaurantId });
        if (delError) console.log("Delete Error:", delError.message);
        else console.log("Delete Success!");
    } else {
        console.log("Not a favorite. Inserting...");
        const { error: insError } = await supabase
            .from('user_favorites')
            .insert({ user_id: userId, restaurant_id: restaurantId });
        if (insError) console.log("Insert Error:", insError.message);
        else console.log("Insert Success!");
    }
}

// IDs from previous inspections
const userId = 'b1d44537-5ec3-4e4f-ac9b-051ff4721151'; // Admin
const restaurantId = 'dc014009-3197-4421-90b1-85e96a2d60a0'; // A restaurant ID from users list? Wait, no.
// Let's get a real restaurant ID first.
async function getFirstRestaurant() {
    const { data } = await supabase.from('restaurants').select('id').limit(1);
    if (data && data[0]) return data[0].id;
    return null;
}

getFirstRestaurant().then(rid => {
    if (rid) testToggle(userId, rid);
});

//Services - For debugging purposes only
import { supabase } from "../config/supabase.js";

export const getPongMessage = () => {
    return 'Pong!';
};

export const supabaseDev = async(name) => {
    const { data, error } = await supabase
        .from('pingpongs')
        .insert({ name });

    if (error) {
        console.error('Error inserting data into Supabase:', error);
        throw new Error('Failed to save data to Supabase');
    };
};
import { supabase } from "../config/supabase.config.js";

export const addPong = async(name) => {
    return { data, error } = await supabase
            .from('pingpongs')
            .insert({ name });
};
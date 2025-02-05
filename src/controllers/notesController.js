import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Criar uma nova nota
export const createNote = async (noteData) => {
    const { text, member_id, user_id } = noteData;
    const { data, error } = await supabase
        .from('notes')
        .insert([{ text, member_id, user_id }])
        .select();

    if (error) throw error;
    return data[0];
};


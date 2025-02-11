import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Criar uma nova nota
const createNote = async (noteData) => {
    const { text, member_id, user_id } = noteData;
    const { data, error } = await supabase
        .from('notes')
        .insert([{ text, member_id, user_id }])
        .select();

    if (error) throw error;
    return data[0];
};

const selectNotesByMember = async (memberId, userId) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('member_id', memberId)
            .eq('user_id', userId)
            .order('date', { ascending: false }); // Order by date descending

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

const deleteNote = async (noteId) => {
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};

export { selectNotesByMember, deleteNote, createNote };

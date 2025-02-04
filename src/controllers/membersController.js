import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Member
export const createMember = async (memberData) => {
    const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select();
    
    if (error) throw error;
    return data[0];
};

// Get Members
export const getMembers = async () => {
    const { data, error } = await supabase
        .from('members')
        .select('*');
    
    if (error) throw error;
    return data;
};

export const getMemberById = async (id) => {
    const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single(); 
    
    if (error) throw error;
    return data;
};

// Update Member
export const updateMember = async (id, memberData) => {
    const { data, error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return data[0];
};

// Delete Member
export const deleteMember = async (id) => {
    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

// Get Ministries for Member
export const getMemberMinistries = async (memberId) => {
    const { data, error } = await supabase
        .from('memberministries')
        .select('ministry_id')
        .eq('member_id', memberId);
    
    if (error) throw error;
    return data;
};
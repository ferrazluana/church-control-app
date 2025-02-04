import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Ministry
export const createMinistry = async (ministryData) => {
    const { data, error } = await supabase
        .from('ministry')
        .insert([ministryData])
        .select();
    
    if (error) throw error;
    return data[0];
};

// Get Ministries
export const getMinistries = async () => {
    const { data, error } = await supabase
        .from('ministry')
        .select(`*, leader:members!ministry_leader_fkey(name), co_leader:members!ministry_co_leader_fkey(name)`);
    
    if (error) throw error;
    return data;
};

// Get Ministries Ativos
export const getMinistriesActives = async () => {
    const { data, error } = await supabase
        .from('ministry')
        .select('*')
        .eq('is_active', true); // Assuming you want to fetch only active ministries
    
    if (error) throw error;
    return data;
};

// Get Ministry by ID
export const getMinistry = async (id) => {
    const { data, error } = await supabase
        .from('ministry')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Update Ministry
export const updateMinistry = async (id, ministryData) => {
    const { data, error } = await supabase
        .from('ministry')
        .update(ministryData)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return data[0];
};

// Delete Ministry
export const deleteMinistry = async (id) => {
    const { error } = await supabase
        .from('ministry')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

// Add Member to Ministry
export const addMemberToMinistry = async (memberId, ministryId) => {
    const { data, error } = await supabase
        .from('memberministries')
        .insert([{ member_id: memberId, ministry_id: ministryId }]);
    
    if (error) {
        console.error('Error adding member to ministry:', error);
        throw error; // You can also throw the error to handle it in the calling function
    }
    return data;
};

// Remove Member from Ministry
export const removeMemberFromMinistry = async (memberId) => {
    const { data, error } = await supabase
        .from('memberministries')
        .delete()
        .match({ member_id: memberId});
    if (error) throw error;
    return data;
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

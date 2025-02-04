import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Course
export const createCourse = async (courseData) => {
    const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select();
    
    if (error) throw error;
    return data[0];
};

// Get Courses
export const getCourses = async () => {
    const { data, error } = await supabase
        .from('courses')
        .select('*');
    
    if (error) throw error;
    return data;
};

// Update Course
export const updateCourse = async (id, courseData) => {
    const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return data[0];
};

// Delete Course
export const deleteCourse = async (id) => {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

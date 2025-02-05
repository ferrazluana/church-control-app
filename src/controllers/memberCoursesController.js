import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enroll a member in a course
export const enrollMemberInCourse = async (memberId, courseId) => {
    const { data, error } = await supabase
        .from('membercourses')
        .insert([{
            member_id: memberId,
            course_id: courseId,
            status: 'active',
            enrollment_date: new Date().toISOString()
        }])
        .select();

    if (error) throw error;
    return data[0];
};

// Get all courses for a member
export const getMemberCourses = async (memberId) => {
    const { data, error } = await supabase
        .from('membercourses')
        .select(`
            id,
            member_id,
            course_id,
            enrollment_date,
            status,
            completion_date,
            courses!inner(*)
        `)
        .eq('member_id', memberId);

    if (error) throw error;
    return data;
};

// Get all members in a course
export const getCourseMembers = async (courseId) => {
    const { data, error } = await supabase
        .from('membercourses')
        .select(`
            id,
            member_id,
            course_id,
            enrollment_date,
            status,
            completion_date,
            members!inner(*)
        `)
        .eq('course_id', courseId);

    if (error) throw error;
    return data;
};

// Update member course status
export const updateMemberCourseStatus = async (memberId, courseId, status, completionDate = null) => {
    const updateData = {
        status: status
    };

    if (completionDate) {
        updateData.completion_date = completionDate;
    }

    const { data, error } = await supabase
        .from('membercourses')
        .update(updateData)
        .match({ member_id: memberId, course_id: courseId })
        .select();

    if (error) throw error;
    return data[0];
};

// Remove member from course
export const removeMemberFromCourse = async (memberId, courseId) => {
    const { error } = await supabase
        .from('membercourses')
        .delete()
        .match({ member_id: memberId, course_id: courseId });

    if (error) throw error;
    return true;
};

// Get active courses for a member
export const getMemberActiveCourses = async (memberId) => {
    const { data, error } = await supabase
        .from('membercourses')
        .select(`
            id,
            member_id,
            course_id,
            enrollment_date,
            status,
            completion_date,
            courses!inner(*)
        `)
        .eq('member_id', memberId)
        .eq('status', 'active');

    if (error) throw error;
    return data;
};

// Get completed courses for a member
export const getMemberCompletedCourses = async (memberId) => {
    const { data, error } = await supabase
        .from('membercourses')
        .select(`
            id,
            member_id,
            course_id,
            enrollment_date,
            status,
            completion_date,
            courses!inner(*)
        `)
        .eq('member_id', memberId)
        .eq('status', 'completed');

    if (error) throw error;
    return data;
};

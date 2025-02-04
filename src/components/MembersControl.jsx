import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwbaghqhbgacmlqmwnaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YmFnaHFoYmdhY21scW13bmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNzQxNTIsImV4cCI6MjA1Mzk1MDE1Mn0.sTaQJjw0hZR37PM_tfwrP-2Gjd6unAue2dg-jCTTwMk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MembersControl = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*');
            if (error) console.error('Error fetching members:', error);
            else setMembers(data);
        };
        fetchMembers();
    }, []);

    return (
        <div>
            <h2>Membros da Igreja</h2>
            <ul>
                {members.map(member => (
                    <li key={member.id}>{member.email} - {member.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default MembersControl;

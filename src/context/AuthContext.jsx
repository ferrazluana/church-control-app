import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://dwbaghqhbgacmlqmwnaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YmFnaHFoYmdhY21scW13bmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNzQxNTIsImV4cCI6MjA1Mzk1MDE1Mn0.sTaQJjw0hZR37PM_tfwrP-2Gjd6unAue2dg-jCTTwMk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Recupera o usuário do localStorage ao inicializar o contexto
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Create User
    const createUser = async (email, password, role) => {
        setLoading(true);
        setError(null);
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([{ email, password_hash: hashedPassword }])
                .select()
                .single();

            if (userError) throw userError;

            // If role is provided, associate it with the user
            if (role) {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .insert([{ user_id: userData.id, role_id: role }]);

                if (roleError) throw roleError;
            }

            console.log('User created successfully');
            return userData;
        } catch (err) {
            setError(err.message);
            console.error('Error creating user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Read Users
    const readUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    user_roles (
                        roles (
                            role_name
                        )
                    )
                `);

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error reading users:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Update User
    const updateUser = async (id, { email, password, role }) => {
        setLoading(true);
        setError(null);
        try {
            const updates = {};
            if (email) updates.email = email;
            if (password) {
                updates.password_hash = await bcrypt.hash(password, 10);
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (userError) throw userError;

            // Update role if provided
            if (role) {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .upsert([{ user_id: id, role_id: role }], { onConflict: 'user_id' });

                if (roleError) throw roleError;
            }

            console.log('User updated successfully');
            return userData;
        } catch (err) {
            setError(err.message);
            console.error('Error updating user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete User
    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('User deleted successfully');
        } catch (err) {
            setError(err.message);
            console.error('Error deleting user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            // Buscar o usuário pelo email
            const { data: users, error: fetchError } = await supabase
                .from('users')
                .select(`
                    *,
                    user_roles (
                        roles (
                            role_name
                        )
                    )
                `)
                .eq('email', email)
                .single();

            if (fetchError) {
                throw new Error('User not found');
            }

            // Verificar a senha
            const isValidPassword = await bcrypt.compare(password, users.password_hash);
            
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
         
            // Se chegou aqui, o login foi bem sucedido
            setUser(users);
            localStorage.setItem('user', JSON.stringify(users));
            return users;

        } catch (error) {
            console.error('Error signing in:', error.message);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error signing out:', error.message);
            setError(error.message);
        }
    };

    const value = {
        user,
        loading,
        error,
        createUser,
        readUsers,
        updateUser,
        deleteUser,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

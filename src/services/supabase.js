// Temporary mock implementation until Supabase is properly set up
export const supabase = {
    from: (table) => ({
        select: () => ({
            eq: () => ({
                single: async () => ({
                    data: {
                        id: 1,
                        email: 'test@example.com',
                        password: 'password123'
                    },
                    error: null
                })
            })
        })
    })
};

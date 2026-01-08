import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                if (!profile) fetchProfile(session.user.id, session.user.email);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId, email) => {
        try {
            // 1. Try to find profile by user_id
            let { data, error } = await supabase
                .from('emp_profile')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            // 2. If not found by ID (first login?), try by email
            if (!data && email) {
                const { data: emailData, error: emailError } = await supabase
                    .from('emp_profile')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                if (emailData) {
                    data = emailData;
                    // Link user_id if missing
                    if (!data.user_id) {
                        await supabase.from('emp_profile').update({ user_id: userId }).eq('email', email);
                    }
                }
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signup = (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    const logout = () => {
        return supabase.auth.signOut();
    };

    const value = {
        user,
        profile,
        role: profile?.role,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

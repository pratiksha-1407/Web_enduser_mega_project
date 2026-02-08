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

            // 3. Device Binding Logic (Security) - wrapped in try/catch for robust schema compatibility
            if (data) {
                const currentDeviceId = getOrCreateDeviceId();

                try {
                    // Start of device logic
                    if (!data.device_id) {
                        // Case A: First time login - Bind this device to the user
                        console.log('🔒 Binding new device to user:', currentDeviceId);
                        const { error: bindError } = await supabase
                            .from('emp_profile')
                            .update({ device_id: currentDeviceId })
                            .eq('id', data.id);

                        if (bindError) {
                            // If column missing, just log/ignore to prevent crash or loops
                            if (bindError.message?.includes('column')) {
                                console.warn('Device Binding skipped: Column device_id missing in DB.');
                            } else {
                                console.error('Device binding failed:', bindError);
                            }
                        } else {
                            data.device_id = currentDeviceId;
                        }
                    } else if (data.device_id !== currentDeviceId) {
                        // Case B: Mismatch - Block Access IF and ONLY IF the DB has a value
                        console.error('⛔ Device Mismatch! Registered:', data.device_id, 'Current:', currentDeviceId);
                        alert('Security Alert: Access Denied.\n\nYou are attempting to login from an unauthorized device. This account is bound to another device.\n\nPlease contact your administrator to reset your device binding.');
                        await supabase.auth.signOut();
                        setUser(null);
                        setProfile(null);
                        return; // Stop loading profile
                    }
                } catch (err) {
                    console.warn('Device binding logic omitted due to error:', err);
                }
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to persist a unique device ID in the browser
    const getOrCreateDeviceId = () => {
        let deviceId = localStorage.getItem('mega_device_id');
        if (!deviceId) {
            // Simple UUID generator
            deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('mega_device_id', deviceId);
        }
        return deviceId;
    };

    const login = async (email, password) => {
        console.log('Attempting login for:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login error details:', error);
        }
        return { data, error };
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

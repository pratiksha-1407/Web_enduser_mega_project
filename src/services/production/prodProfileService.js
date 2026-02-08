import { supabase } from '../supabaseClient';

// Fetch the current user's profile
export const fetchuserProfile = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('No authenticated user found');
            return null;
        }

        let profileData = null;

        // 1. Try fetching by user_id
        const { data: userData, error: userError } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (userData) {
            profileData = userData;
        } else {
            // 2. Fallback: Try fetching by email
            const { data: emailData, error: emailError } = await supabase
                .from('emp_profile')
                .select('*')
                .eq('email', user.email)
                .maybeSingle();

            if (emailData) {
                profileData = emailData;
            }
        }

        if (!profileData) {
            // Return default/mock profile if not found, matching Flutter fallback logic
            return {
                emp_id: `PM${Date.now() % 1000}`,
                full_name: 'Production Manager',
                position: 'Production Manager',
                branch: 'Production Unit',
                department: 'Production',
                joining_date: new Date().toISOString(),
                status: 'Active',
                phone: '9876543210',
                email: user.email || 'production@mega.com',
                performance: 92.0,
                attendance: 96.0,
                role: 'Production Manager',
                salary: 0,
                shift: 'Day',
                experience: '5 years',
                is_default: true
            };
        }

        return profileData;

    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

// Sign out
export const logoutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        return false;
    }
};

import { supabase } from './supabaseClient';

/**
 * Fetch employee profile details
 */
export async function fetchEmployeeProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

/**
 * Fetch monthly sales targets for the employee
 */
export async function fetchEmployeeTargets() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!profile) throw new Error("Profile not found");

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const { data, error } = await supabase
            .from('emp_mar_targets')
            .select('*')
            .eq('employee_id', profile.id)
            .eq('month', currentMonth)
            .eq('year', currentYear)
            .maybeSingle();

        if (error) throw error;
        return data || { target_amount: 0, achieved_amount: 0 };
    } catch (error) {
        console.error("Error fetching targets:", error);
        return { target_amount: 0, achieved_amount: 0 };
    }
}

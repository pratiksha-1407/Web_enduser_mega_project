import { supabase } from './supabaseClient';

/**
 * Check if attendance is already marked for today
 */
export async function checkTodayAttendance() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!profile) throw new Error("Profile not found");

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('emp_attendance')
            .select('*')
            .eq('employee_id', profile.id)
            .eq('date', today)
            .maybeSingle();

        if (error) throw error;
        return { marked: !!data, data };
    } catch (error) {
        console.error("Error checking attendance:", error);
        return { marked: false, error: error.message };
    }
}

/**
 * Mark attendance with location
 */
export async function markAttendance({ latitude, longitude, photoUrl = null }) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!profile) throw new Error("Profile not found");

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toLocaleTimeString('en-US', { hour12: false });

        // Logic for Late/Present status (e.g., late after 10:00 AM)
        const isLate = now.getHours() >= 10 && now.getMinutes() > 0;
        const status = isLate ? 'Late' : 'Present';

        const { data, error } = await supabase
            .from('emp_attendance')
            .insert([{
                employee_id: profile.id,
                date: date,
                check_in_time: time,
                check_in_location: `${latitude},${longitude}`, // Storing as string "lat,long"
                check_in_photo_url: photoUrl,
                status: status
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error marking attendance:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch attendance history for the employee
 */
export async function fetchAttendanceHistory(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        // Construct date range for the month
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`; // Simplified end date

        const { data, error } = await supabase
            .from('emp_attendance')
            .select('*')
            .eq('employee_id', profile.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}

import { supabase } from './supabaseClient';

export const attendanceService = {
    async checkTodayAttendance(empId) {
        const today = new Date().toISOString().split('T')[0];
        let userId = empId;

        if (!userId) {
            const { data: { user } } = await supabase.auth.getUser();
            userId = user?.id;
        }
        if (!userId) return false;

        const { data, error } = await supabase
            .from('emp_attendance')
            .select()
            .eq('employee_id', userId)
            .eq('date', today)
            .maybeSingle();

        if (error) console.error('Error checking attendance:', error);
        return !!data;
    },

    async markAttendance({ employeeName, location, selfieUrl }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in");

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const { data, error } = await supabase
            .from('emp_attendance')
            .insert({
                employee_id: user.id,
                employee_name: employeeName || user.email,
                date,
                marked_time: time,
                location,
                selfie_url: selfieUrl
            })
            .select();

        if (error) throw error;
        return data;
    },

    async getAttendanceHistory(month = null) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let query = supabase
            .from('emp_attendance')
            .select('*')
            .eq('employee_id', user.id)
            .order('date', { ascending: false });

        if (month && month !== 'all') {
            const startOfMonth = `${month}-01`;
            const [y, m] = month.split('-');
            const lastDay = new Date(y, m, 0).getDate();
            const endOfMonth = `${month}-${lastDay}`;
            query = query.gte('date', startOfMonth).lte('date', endOfMonth);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching attendance history", error);
            return [];
        }

        return data.map(record => ({
            ...record,
            status: record.status || 'Present',
            clock_in: record.marked_time,
            clock_out: record.clock_out_time || record.clock_out || '-'
        }));
    },

    async uploadAttendanceImage(blob) {
        const fileName = `attendance_${Date.now()}.jpg`;
        const filePath = `attendance/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('emp_profile_images')
            .upload(filePath, blob, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('emp_profile_images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};

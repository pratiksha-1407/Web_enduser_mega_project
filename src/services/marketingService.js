import { supabase } from './supabaseClient';

export const marketingService = {
    // ===================== PROFILE & AUTH =====================
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // ===================== DASHBOARD DATA =====================
    async getManagerTarget(managerId, month) {
        // month should be 'YYYY-MM-01'
        const { data, error } = await supabase
            .from('own_marketing_targets')
            .select('*')
            .eq('manager_id', managerId)
            .eq('target_month', month)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    // ===================== TEAM MANAGEMENT =====================
    async getTeamMembers(district) {
        const { data, error } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('district', district)
            .neq('role', 'Marketing Manager')
            .eq('status', 'Active')
            .order('full_name');

        if (error) throw error;
        return data;
    },

    async getTeamTargets(employeeIds, month) {
        const { data, error } = await supabase
            .from('emp_mar_targets')
            .select('*')
            .eq('target_month', month)
            .in('emp_id', employeeIds);

        if (error) throw error;
        return data;
    },

    async assignTargetsToTeam(assignments) {
        const { data, error } = await supabase
            .from('emp_mar_targets')
            .upsert(assignments, { onConflict: 'emp_id,target_month' });

        if (error) throw error;
        return data;
    },

    // ===================== ORDERS =====================
    async placeOrder(orderData) {
        const { data, error } = await supabase
            .from('emp_mar_orders')
            .insert([orderData]);

        if (error) throw error;
        return data;
    },

    // ===================== REPORTS / VISITS =====================
    async submitVisitReport(reportData) {
        const { data, error } = await supabase
            .from('manager_visits')
            .insert([reportData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async uploadVisitPhoto(file, folder) {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const path = `${folder}/${fileName}`;

        const { error } = await supabase.storage
            .from('manager_uploads')
            .upload(path, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('manager_uploads')
            .getPublicUrl(path);

        return publicUrl;
    }
};

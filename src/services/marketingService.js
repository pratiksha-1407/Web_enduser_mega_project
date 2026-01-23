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

    async getTalukaSales(district) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data: orders, error } = await supabase
            .from('emp_mar_orders')
            .select('taluka, total_weight, weight_unit, status')
            .eq('district', district)
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth)
            .in('status', ['Completed', 'Delivered', 'Dispatched']);

        if (error) throw error;

        // Aggregate Sales
        const talukaSales = {};
        let totalSales = 0;

        orders.forEach(order => {
            const taluka = order.taluka || 'Unknown';
            let weightInTons = 0;
            const weight = parseFloat(order.total_weight || 0);

            if (order.weight_unit === 'ton') weightInTons = weight;
            else if (order.weight_unit === 'kg') weightInTons = weight / 1000;
            else if (order.weight_unit === 'g') weightInTons = weight / 1000000;

            talukaSales[taluka] = (talukaSales[taluka] || 0) + weightInTons;
            totalSales += weightInTons;
        });

        // Format for Chart
        const chartData = Object.entries(talukaSales).map(([taluka, sales]) => ({
            taluka,
            sales: parseFloat(sales.toFixed(2))
        }));

        return { totalSales, chartData };
    },

    async getTeamPerformance(managerId) {
        // 1. Get Team Members
        const { data: employees, error: teamError } = await supabase
            .from('emp_profile')
            .select('id, full_name, emp_id')
            .eq('reporting_to', managerId)
            .eq('role', 'Marketing Executive');

        if (teamError) throw teamError;
        if (!employees || employees.length === 0) return null;

        const empIds = employees.map(e => e.id);
        const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

        // 2. Get Targets
        const { data: targets, error: targetError } = await supabase
            .from('marketing_targets')
            .select('*')
            .in('marketing_executive_id', empIds)
            .eq('target_month', currentMonth);

        // 3. Get Orders (Revenue & Count)
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data: orders, error: orderError } = await supabase
            .from('emp_mar_orders') // Assuming orders are here
            .select('created_by, total_price')
            .in('created_by', empIds)
            .gte('created_at', startOfMonth);

        if (targetError) throw targetError;
        if (orderError) throw orderError;

        // 4. Aggregate Data
        let totalAchievedRevenue = 0;
        let totalAchievedOrders = 0;
        let totalProgressSum = 0;
        let activeEmployeesCount = 0;

        const performers = employees.map(emp => {
            const empTarget = targets?.find(t => t.marketing_executive_id === emp.id);
            const empOrders = orders?.filter(o => o.created_by === emp.id) || [];

            const revenue = empOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
            const orderCount = empOrders.length;

            const revTarget = empTarget?.revenue_target || 1; // Avoid div by 0
            const ordTarget = empTarget?.order_target || 1;

            const revProgress = Math.min(revenue / revTarget, 1);
            const ordProgress = Math.min(orderCount / ordTarget, 1);
            const overallProgress = (revProgress + ordProgress) / 2;

            if (empTarget) {
                activeEmployeesCount++;
                totalProgressSum += overallProgress;
            }

            return {
                id: emp.id,
                name: emp.full_name,
                achievedRevenue: revenue,
                achievedOrders: orderCount,
                overallProgress
            };
        });

        // Calculate Totals
        totalAchievedRevenue = performers.reduce((sum, p) => sum + p.achievedRevenue, 0);
        totalAchievedOrders = performers.reduce((sum, p) => sum + p.achievedOrders, 0);

        // Sort Top Performers
        performers.sort((a, b) => b.overallProgress - a.overallProgress);

        return {
            totalAchievedRevenue,
            totalAchievedOrders,
            averageProgress: activeEmployeesCount > 0 ? (totalProgressSum / activeEmployeesCount) * 100 : 0,
            activeEmployees: activeEmployeesCount,
            totalEmployees: employees.length,
            topPerformers: performers.slice(0, 3)
        };
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

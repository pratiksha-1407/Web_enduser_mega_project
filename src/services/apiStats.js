import { supabase } from './supabaseClient';

/**
 * Fetch employee statistics (total orders, pending orders, etc.)
 */
export async function fetchEmployeeStats() {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Fetch employee profile to get employee_id
        const { data: profile, error: profileError } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        const employeeId = profile.id;

        // Fetch total orders count
        const { count: totalOrders, error: totalError } = await supabase
            .from('emp_mar_orders')
            .select('*', { count: 'exact', head: true })
            .eq('employee_id', employeeId);

        if (totalError) throw totalError;

        // Fetch pending orders count
        const { count: pendingOrders, error: pendingError } = await supabase
            .from('emp_mar_orders')
            .select('*', { count: 'exact', head: true })
            .eq('employee_id', employeeId)
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Fetch completed orders count
        const { count: completedOrders, error: completedError } = await supabase
            .from('emp_mar_orders')
            .select('*', { count: 'exact', head: true })
            .eq('employee_id', employeeId)
            .eq('status', 'completed');

        if (completedError) throw completedError;

        // Calculate total revenue from completed orders
        const { data: revenueData, error: revenueError } = await supabase
            .from('emp_mar_orders')
            .select('total_price')
            .eq('employee_id', employeeId)
            .eq('status', 'completed');

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, order) => sum + (order.total_price || 0), 0);

        return {
            totalOrders: totalOrders || 0,
            pendingOrders: pendingOrders || 0,
            completedOrders: completedOrders || 0,
            totalRevenue: totalRevenue || 0
        };
    } catch (error) {
        console.error('Error fetching employee stats:', error);
        return {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalRevenue: 0
        };
    }
}

/**
 * Fetch recent orders for the logged-in employee
 * @param {number} limit - Number of orders to fetch (default: 10)
 */
export async function fetchRecentOrders(limit = 10) {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Fetch employee profile to get employee_id
        const { data: profile, error: profileError } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        const employeeId = profile.id;

        // Fetch recent orders
        const { data: orders, error } = await supabase
            .from('emp_mar_orders')
            .select('*')
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return orders || [];
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

/**
 * Fetch all orders for the logged-in employee with optional filtering
 * @param {Object} filters - Filter options (status, dateFrom, dateTo)
 */
export async function fetchEmployeeOrders(filters = {}) {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Fetch employee profile to get employee_id
        const { data: profile, error: profileError } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        const employeeId = profile.id;

        // Build query
        let query = supabase
            .from('emp_mar_orders')
            .select('*')
            .eq('employee_id', employeeId);

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.dateFrom) {
            query = query.gte('created_at', filters.dateFrom);
        }

        if (filters.dateTo) {
            query = query.lte('created_at', filters.dateTo);
        }

        // Order by most recent
        query = query.order('created_at', { ascending: false });

        const { data: orders, error } = await query;

        if (error) throw error;

        return orders || [];
    } catch (error) {
        console.error('Error fetching employee orders:', error);
        return [];
    }
}

/**
 * Fetch monthly performance data for charts
 */
export async function fetchMonthlyPerformance() {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Fetch employee profile
        const { data: profile, error: profileError } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        const employeeId = profile.id;
        const currentYear = new Date().getFullYear();

        // Fetch orders for the current year
        const { data: orders, error } = await supabase
            .from('emp_mar_orders')
            .select('created_at, total_price, status')
            .eq('employee_id', employeeId)
            .gte('created_at', `${currentYear}-01-01`)
            .lte('created_at', `${currentYear}-12-31`);

        if (error) throw error;

        // Group by month
        const monthlyData = Array(12).fill(0).map((_, index) => ({
            month: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
            orders: 0,
            revenue: 0
        }));

        orders.forEach(order => {
            const month = new Date(order.created_at).getMonth();
            monthlyData[month].orders += 1;
            if (order.status === 'completed') {
                monthlyData[month].revenue += order.total_price || 0;
            }
        });

        return monthlyData;
    } catch (error) {
        console.error('Error fetching monthly performance:', error);
        return [];
    }
}

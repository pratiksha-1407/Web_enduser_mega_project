import { supabase } from '../supabaseClient';

// Helper to get today's date at midnight
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Fetch Production Manager's District
export const getProductionManagerDistrict = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('emp_profile')
            .select('district')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        return data?.district || null;
    } catch (error) {
        console.error('Error fetching district:', error);
        return null;
    }
};

// Fetch Orders with filters and pagination
export const fetchProductionOrders = async ({
    page = 0,
    limit = 20,
    filter = 'all',
    district = null
}) => {
    try {
        let query = supabase
            .from('emp_mar_orders')
            .select('*', { count: 'exact' });

        // Apply District Filter
        if (district) {
            query = query.eq('district', district);
        }

        // Apply Status Filter
        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        // Pagination & Sorting
        query = query
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        const { data, count, error } = await query;

        if (error) throw error;

        return { data, count };
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Update Order Status
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const { error } = await supabase
            .from('emp_mar_orders')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// Bulk Update Status
export const bulkUpdateOrderStatus = async (orderIds, newStatus) => {
    try {
        const { error } = await supabase
            .from('emp_mar_orders')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .in('id', orderIds);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error bulk updating orders:', error);
        throw error;
    }
};

// Get Order Statistics
export const fetchOrderStatistics = async (district = null) => {
    try {
        let statsQuery = supabase
            .from('emp_mar_orders')
            .select('status');

        if (district) {
            statsQuery = statsQuery.eq('district', district);
        }

        const { data, error } = await statsQuery;

        if (error) throw error;

        const stats = {
            total: data.length,
            pending: 0,
            packing: 0,
            ready_for_dispatch: 0,
            dispatched: 0,
            delivered: 0,
            completed: 0,
            cancelled: 0
        };

        data.forEach(order => {
            const status = (order.status || '').toLowerCase();
            if (stats[status] !== undefined) {
                stats[status]++;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return null;
    }
};

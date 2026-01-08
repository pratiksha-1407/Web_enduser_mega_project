import { supabase } from './supabaseClient';

/**
 * Fetch products for dropdown selection
 */
export async function fetchProducts() {
    try {
        const { data, error } = await supabase
            .from('own_products')
            .select('*')
            .eq('status', 'active');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/**
 * Create a new order
 */
export async function createOrder(orderData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get employee ID
        const { data: profile } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!profile) throw new Error("Employee profile not found");

        const newOrder = {
            ...orderData,
            employee_id: profile.id,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('emp_mar_orders')
            .insert([newOrder])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch orders with pagination and filtering
 */
export async function fetchOrders({ page = 1, pageSize = 10, status = 'all' } = {}) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: profile, error: profileError } = await supabase
            .from('emp_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        let query = supabase
            .from('emp_mar_orders')
            .select('*', { count: 'exact' })
            .eq('employee_id', profile.id);

        if (status !== 'all') {
            query = query.eq('status', status);
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { data: data || [], count: count || 0 };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { data: [], count: 0 };
    }
}

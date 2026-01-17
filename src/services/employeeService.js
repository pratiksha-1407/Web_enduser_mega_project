import { supabase } from './supabaseClient';

export const employeeService = {
    // ==================== PROFILE ====================
    async loadEmployeeProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            console.error('Error loading employee profile:', error);
            return null;
        }
        return data;
    },

    async updateEmployeeProfile(profileId, updates) {
        if (!profileId) throw new Error("Profile ID is required");

        const { data, error } = await supabase
            .from('emp_profile')
            .update(updates)
            .eq('id', profileId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async uploadProfileImage(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `profile_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('emp_profile_images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('emp_profile_images')
            .getPublicUrl(filePath);

        return publicUrl;
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
    },

    // ==================== ORDERS ====================
    async getOrders() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('emp_mar_orders')
            .select('*')
            .eq('employee_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        return data.map(order => ({
            ...order,
            display_id: order.order_number ? order.order_number.toString() : `#${order.id.substring(0, 8).toUpperCase()}`
        }));
    },

    async createOrder(orderData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in");

        const { bags, weight_per_bag, price_per_bag, customer_name, customer_mobile, customer_address, feed_category, weight_unit, remarks } = orderData;
        const total_weight = bags * weight_per_bag;
        const total_price = bags * price_per_bag;

        const { data, error } = await supabase
            .from('emp_mar_orders')
            .insert({
                employee_id: user.id,
                customer_name,
                customer_mobile,
                customer_address,
                feed_category,
                bags,
                weight_per_bag,
                weight_unit,
                total_weight,
                price_per_bag,
                total_price,
                remarks,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getOrderCounts() {
        const orders = await this.getOrders();
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            packing: orders.filter(o => o.status === 'packing').length,
            ready_for_dispatch: orders.filter(o => o.status === 'ready_for_dispatch').length,
            dispatched: orders.filter(o => o.status === 'dispatched').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
        };
    },

    // ==================== ATTENDANCE ====================
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
            .select('*') // Get all columns including potentially clock_out_time/status
            .eq('employee_id', user.id)
            .order('date', { ascending: false });

        if (month && month !== 'all') {
            // month format YYYY-MM
            const startOfMonth = `${month}-01`;
            // Calculate last day properly
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

        // Map data to ensure consistency if columns missing
        return data.map(record => ({
            ...record,
            status: record.status || 'Present', // Default status if column missing
            clock_in: record.marked_time,       // Map marked_time to clock_in
            clock_out: record.clock_out_time || record.clock_out || '-' // Check both
        }));
    },

    // ==================== TARGETS ====================
    async loadTargetData(empId) {
        if (!empId) return { targets: [], achieved: [] };

        const currentYear = new Date().getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => `${currentYear}-${String(i + 1).padStart(2, '0')}`);

        // Fetch Targets
        const { data: targetsData, error: targetError } = await supabase
            .from('emp_mar_targets')
            .select('target_month, target_amount')
            .eq('emp_id', empId)
            .like('target_month', `${currentYear}-%`)
            .order('target_month');

        if (targetError) {
            console.error("Error fetching targets:", targetError);
        }

        const targetMap = {};
        months.forEach(m => targetMap[m] = 0);
        targetsData?.forEach(row => {
            if (targetMap.hasOwnProperty(row.target_month)) {
                targetMap[row.target_month] = parseFloat(row.target_amount) || 0;
            }
        });

        // Fetch Achieved
        const { data: achievedData, error: achievedError } = await supabase
            .from('cattle_feed_orders')
            .select('*')
            .eq('emp_id', empId)
            .gte('created_at', `${currentYear}-01-01T00:00:00`)
            .lte('created_at', `${currentYear}-12-31T23:59:59`);

        if (achievedError) {
            console.error("Error fetching achieved data:", achievedError);
        }

        const achievedMap = {};
        months.forEach(m => achievedMap[m] = 0);

        achievedData?.forEach(order => {
            const status = (order.order_status || order.status || '').toLowerCase();
            const isCompleted = status.includes('complete') || status.includes('deliver') || status.includes('confirm');

            if (!isCompleted || !order.created_at) return;

            const date = new Date(order.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            let quantity = 0;
            const quantityFields = ['tons', 'quantity', 'bags', 'order_quantity', 'qty', 'weight', 'total_quantity'];

            for (const field of quantityFields) {
                if (order[field] !== undefined && order[field] !== null) {
                    quantity = parseFloat(order[field]) || 0;
                    if (quantity > 0) break;
                }
            }

            if (quantity > 0 && achievedMap.hasOwnProperty(monthKey)) {
                achievedMap[monthKey] += quantity;
            }
        });

        return {
            targets: months.map(m => targetMap[m]),
            achieved: months.map(m => achievedMap[m]),
            months: months
        };
    }
};

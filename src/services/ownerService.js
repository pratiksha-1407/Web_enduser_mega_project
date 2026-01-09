import { supabase } from './supabaseClient';

export const ownerService = {
    // ===================== HELPERS =====================
    _formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // ===================== REVENUE =====================
    async getTotalRevenue() {
        try {
            const { data, error } = await supabase
                .from('emp_mar_orders')
                .select('total_price')
                .eq('status', 'completed');

            if (error) throw error;

            return data.reduce((sum, row) => sum + (row.total_price || 0), 0);
        } catch (error) {
            console.error('getTotalRevenue error:', error);
            return 0;
        }
    },

    // ===================== COUNTS =====================
    async getTotalOrders() {
        try {
            const { count, error } = await supabase
                .from('emp_mar_orders')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('getTotalOrders error:', error);
            return 0;
        }
    },

    async getPendingOrdersCount() {
        try {
            const { count, error } = await supabase
                .from('emp_mar_orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('getPendingOrdersCount error:', error);
            return 0;
        }
    },

    async getActiveEmployeesCount() {
        try {
            const { count, error } = await supabase
                .from('emp_profile')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Active')
                .eq('role', 'Employee');

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('getActiveEmployeesCount error:', error);
            return 0;
        }
    },

    // ===================== CHART DATA =====================
    async getRevenueChartData() {
        try {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { data, error } = await supabase
                .from('emp_mar_orders')
                .select('created_at, total_price')
                .eq('status', 'completed')
                .gte('created_at', weekAgo.toISOString());

            if (error) throw error;

            const revenue = {
                'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
            };

            data.forEach(order => {
                try {
                    const date = new Date(order.created_at);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    if (revenue[dayName] !== undefined) {
                        revenue[dayName] += (order.total_price || 0);
                    }
                } catch (e) {
                    console.error("Error processing chart order:", e);
                }
            });

            // Sort by day of week if needed, or just return list
            const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return daysOrder.map(day => ({
                day,
                revenue: revenue[day]
            }));

        } catch (error) {
            console.error('getRevenueChartData error:', error);
            // Return default data for UI stability if fetch fails
            return [
                { day: 'Mon', revenue: 0 },
                { day: 'Tue', revenue: 0 },
                { day: 'Wed', revenue: 0 },
                { day: 'Thu', revenue: 0 },
                { day: 'Fri', revenue: 0 },
                { day: 'Sat', revenue: 0 },
                { day: 'Sun', revenue: 0 },
            ];
        }
    },

    // ===================== TOP PRODUCTS =====================
    async getTopProducts() {
        try {
            // Try primary table first
            const { data: orderItems, error: itemsError } = await supabase
                .from('own_order_items')
                .select('product_id, quantity, total_price, product:own_products(name)')
                .limit(1);

            if (!itemsError && orderItems && orderItems.length > 0) {
                // Implementation for own_order_items logic if data exists
                const { data, error } = await supabase
                    .from('own_order_items')
                    .select('product_id, quantity, total_price, product:own_products(name)');

                if (error) throw error;

                const map = {};
                data.forEach(item => {
                    const id = item.product_id;
                    if (!id) return;
                    const name = item.product?.name || 'Unknown Product';

                    if (!map[id]) map[id] = { name, sales: 0, revenue: 0 };
                    map[id].sales += (item.quantity || 0);
                    map[id].revenue += (item.total_price || 0);
                });

                return Object.values(map)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3);
            }

            // Fallback
            return await this._topProductsFallback();
        } catch (error) {
            console.error('getTopProducts error:', error);
            return await this._topProductsFallback();
        }
    },

    async _topProductsFallback() {
        try {
            const { data, error } = await supabase
                .from('emp_mar_orders')
                .select('feed_category, bags, total_price')
                .eq('status', 'completed');

            if (error) throw error;

            const map = {};
            data.forEach(order => {
                const category = order.feed_category || 'Unknown';
                if (!map[category]) map[category] = { name: category, sales: 0, revenue: 0 };
                map[category].sales += (order.bags || 0);
                map[category].revenue += (order.total_price || 0);
            });

            return Object.values(map)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3);
        } catch (error) {
            console.error('Top products fallback error:', error);
            return [];
        }
    },

    // ===================== RECENT ACTIVITY =====================
    async getRecentActivities() {
        try {
            // Try primary table first
            const { data: logs, error: logsError } = await supabase
                .from('own_activity_logs')
                .select('activity_type, description, created_at')
                .order('created_at', { ascending: false })
                .limit(1);

            if (!logsError && logs && logs.length > 0) {
                const { data, error } = await supabase
                    .from('own_activity_logs')
                    .select('activity_type, description, created_at')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;

                return data.map(row => this._mapActivity(row.activity_type, row.description, row.created_at));
            }

            // Fallback
            return await this._activityFallback();
        } catch (error) {
            console.error('getRecentActivities error:', error);
            return await this._activityFallback();
        }
    },

    _mapActivity(type, description, createdAt) {
        const timeAgo = this._calculateTimeAgo(createdAt);
        const meta = this._getActivityMeta(type);
        return {
            title: meta.title,
            time: timeAgo,
            icon: meta.icon, // Return string identifier for icon component to handle
            color: meta.color,
            description
        };
    },

    _getActivityMeta(type) {
        switch (type?.toLowerCase()) {
            case 'order_created': return { title: 'New Order Received', icon: 'ShoppingCart', color: 'green' };
            case 'payment_received': return { title: 'Payment Received', icon: 'CreditCard', color: 'blue' };
            case 'stock_updated': return { title: 'Stock Updated', icon: 'Package', color: 'orange' };
            case 'employee_added': return { title: 'New Employee Added', icon: 'UserPlus', color: 'purple' };
            case 'order_completed': return { title: 'Order Completed', icon: 'CheckCircle', color: 'green' };
            default: return { title: type || 'Activity', icon: 'Bell', color: 'grey' };
        }
    },

    async _activityFallback() {
        try {
            const { data, error } = await supabase
                .from('emp_mar_orders')
                .select('customer_name, feed_category, status, created_at')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;

            return data.map(order => {
                const timeAgo = this._calculateTimeAgo(order.created_at);
                let meta = { title: 'Order Updated', icon: 'Clock', color: 'grey' };

                switch (order.status) {
                    case 'pending': meta = { title: 'New Order Received', icon: 'ShoppingCart', color: 'green' }; break;
                    case 'completed': meta = { title: 'Order Completed', icon: 'CheckCircle', color: 'blue' }; break;
                    case 'dispatched': meta = { title: 'Order Dispatched', icon: 'Truck', color: 'orange' }; break;
                }

                return {
                    title: meta.title,
                    time: timeAgo,
                    icon: meta.icon,
                    color: meta.color,
                    description: `${order.customer_name || 'Unknown'} - ${order.feed_category || 'Order'}`
                };
            });
        } catch (error) {
            console.error('Activity fallback error:', error);
            return [];
        }
    },

    _calculateTimeAgo(dateString) {
        const diff = new Date() - new Date(dateString);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} mins ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    },

    // ===================== DASHBOARD AGGREGATE =====================
    // ===================== DASHBOARD AGGREGATE =====================
    async getDashboardData() {
        try {
            const [totalRevenue, totalOrders, activeEmployees, pendingOrders, topProducts, recentActivities, revenueChartData] = await Promise.all([
                this.getTotalRevenue(),
                this.getTotalOrders(),
                this.getActiveEmployeesCount(),
                this.getPendingOrdersCount(),
                this.getTopProducts(),
                this.getRecentActivities(),
                this.getRevenueChartData()
            ]);

            return {
                totalRevenue,
                totalOrders,
                activeEmployees,
                pendingOrders,
                topProducts,
                recentActivities,
                revenueChartData,
                revenueGrowth: 12.5, // Mocked as per Flutter source
                orderGrowth: 8.2,
                employeeGrowth: 3.5
            };
        } catch (error) {
            console.error('getDashboardData error:', error);
            throw error;
        }
    },

    // ===================== EMPLOYEE MANAGEMENT =====================
    async getEmployees() {
        const { data, error } = await supabase
            .from('emp_profile')
            .select('*')
            .eq('role', 'Employee')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // ===================== INVENTORY =====================
    async getInventory() {
        try {
            const { data, error } = await supabase
                .from('own_products')
                .select('*');

            if (error) {
                console.warn('Inventory fetch failed, checking fallback');
                return [];
            }
            return data;
        } catch (error) {
            console.error('getInventory error:', error);
            return [];
        }
    },

    // ===================== SALES ANALYTICS =====================
    async getSalesAnalytics() {
        try {
            // Fetch all completed orders
            const { data, error } = await supabase
                .from('emp_mar_orders')
                .select('total_price, bags, customer_name, customer_address, feed_category')
                .eq('status', 'completed');

            if (error) throw error;

            // 1. Top Customers
            const customers = {};
            data.forEach(order => {
                const name = order.customer_name || 'Unknown';
                if (!customers[name]) customers[name] = { name, orders: 0, value: 0 };
                customers[name].orders += 1;
                customers[name].value += (order.total_price || 0);
            });

            const topCustomers = Object.values(customers)
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map(c => ({
                    ...c,
                    status: c.value > 100000 ? 'Premium' : 'Regular', // Logic inferred
                    growth: 10 // Mocked growth
                }));

            // 2. Sales Performance (Product Wise)
            const products = {};
            data.forEach(order => {
                const cat = order.feed_category || 'General';
                if (!products[cat]) products[cat] = { product: cat, sales: 0, units: 0, region: 'All' };
                products[cat].sales += (order.total_price || 0);
                products[cat].units += (order.bags || 0);
            });

            const salesData = Object.values(products)
                .sort((a, b) => b.sales - a.sales);

            return {
                topCustomers,
                salesData
            };
        } catch (error) {
            console.error('getSalesAnalytics error:', error);
            return { topCustomers: [], salesData: [] };
        }
    },

    // ===================== REPORTS / TARGETS =====================
    async getTargets() {
        try {
            const { data, error } = await supabase
                .from('emp_mar_targets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Targets fetch failed, returning mock/empty');
                return [];
            }
            // Transform for UI consistency
            return data.map(t => ({
                id: t.id,
                branch: t.branch || 'All Branches',
                manager: t.manager_id || 'All Managers',
                month: t.target_month || 'N/A',
                revenue: t.target_amount || '0',
                orders: '0', // Adjust if schema supports orders
                remarks: t.remarks || ''
            }));
        } catch (error) {
            console.error('getTargets error:', error);
            return [];
        }
    },

    // ===================== ANNOUNCEMENTS =====================
    async getAnnouncements() {
        try {
            const { data, error } = await supabase
                .from('own_activity_logs')
                .select('*')
                .eq('activity_type', 'announcement')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(log => ({
                id: log.id,
                time: this._formatDate(log.created_at),
                message: log.description
            }));
        } catch (error) {
            console.error('Error fetching announcements:', error);
            // Fallback mock
            return [
                { id: '1', time: '2 hours ago', message: 'New inventory shipment arriving this Friday. Please update stock records.' },
                { id: '2', time: '1 day ago', message: 'Monthly sales meeting scheduled for Monday at 10 AM.' }
            ];
        }
    },

    async assignTarget(targetData) {
        try {
            // Mapping UI fields to Supabase schema: emp_mar_targets
            const { data, error } = await supabase
                .from('emp_mar_targets')
                .insert([{
                    branch: targetData.branch,
                    manager_id: targetData.manager_id,
                    target_amount: targetData.target_amount,
                    target_month: targetData.target_month,
                    remarks: targetData.remarks
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error assigning target:', error);
            throw error;
        }
    },

    async sendAnnouncement(message) {
        try {
            const { data, error } = await supabase
                .from('own_activity_logs')
                .insert([{
                    activity_type: 'announcement',
                    description: message,
                    // title, color, icon are usually derived in UI mapping
                    // but if the table doesn't have these columns, insert fails.
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error sending announcement:', error);
            throw error;
        }
    },


};

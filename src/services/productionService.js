import { supabase } from './supabaseClient';

export const productionService = {
    // ===================== INVENTORY =====================
    async getInventory() {
        const { data, error } = await supabase
            .from('production_products')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getTotalInventoryBags() {
        const { data, error } = await supabase
            .from('production_products')
            .select('bags')
            .eq('is_active', true);

        if (error) throw error;
        return data.reduce((sum, item) => sum + (item.bags || 0), 0);
    },

    // ===================== PRODUCTION METRICS =====================
    async getProductionMetrics() {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get Today's Production
        const { data: prodLogs, error: logError } = await supabase
            .from('pro_production_logs')
            .select('quantity_produced')
            .eq('production_date', today);

        if (logError) throw logError;

        const totalProduced = prodLogs.reduce((sum, log) => sum + (log.quantity_produced || 0), 0);

        // 2. Get Targets
        const { data: targetData, error: targetError } = await supabase
            .from('pro_production_targets')
            .select('target_quantity')
            .eq('start_date', today)
            .maybeSingle();

        if (targetError) throw targetError;

        return {
            produced: totalProduced,
            target: targetData?.target_quantity || 120 // Default target from Flutter
        };
    },

    async getMachineStatus() {
        const { data, error } = await supabase
            .from('pro_machines')
            .select('status')
            .eq('is_active', true);

        if (error) throw error;

        const active = data.filter(m => m.status === 'running').length;
        const total = data.length;
        // Mock Quality Rate as per Flutter logic: 95 + random
        const quality = 95.0 + (new Date().getMilliseconds() % 100) * 0.05;

        return {
            active,
            total,
            quality: parseFloat(quality.toFixed(1))
        };
    },

    // ===================== FINANCIALS =====================
    async getProfitMetrics() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        const today = now.toISOString().split('T')[0];

        // 1. Revenue (Completed Orders)
        const { data: orders, error: orderError } = await supabase
            .from('emp_mar_orders')
            .select('total_price')
            .in('status', ['completed', 'delivered', 'dispatched', 'Completed', 'Delivered', 'Dispatched'])
            .gte('created_at', startOfMonth.split('T')[0]) // Simplified date filter
            .lte('created_at', today);

        if (orderError) throw orderError;

        const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

        // 2. Raw Material Cost
        const { data: usage, error: usageError } = await supabase
            .from('pro_raw_material_usage')
            .select(`
                total_cost,
                pro_inventory!inner(name)
            `)
            .gte('usage_date', startOfMonth.split('T')[0])
            .lte('usage_date', today);

        if (usageError) throw usageError;

        let totalMaterialCost = 0;
        const materialBreakdown = {};

        usage.forEach(record => {
            const cost = record.total_cost || 0;
            const name = record.pro_inventory?.name || 'Unknown';
            totalMaterialCost += cost;
            materialBreakdown[name] = (materialBreakdown[name] || 0) + cost;
        });

        // 3. Calculate Profit
        const totalProfit = totalRevenue - totalMaterialCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return {
            totalRevenue,
            totalMaterialCost,
            totalProfit,
            profitMargin,
            materialBreakdown
        };
    },

    // ===================== ORDERS =====================
    async getRecentOrders() {
        const { data, error } = await supabase
            .from('emp_mar_orders')
            .select('*')
            .in('status', ['completed', 'delivered', 'dispatched', 'Completed', 'Delivered', 'Dispatched'])
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;
        return data;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from('emp_mar_orders')
            .select('*')
            .in('status', ['completed', 'delivered', 'dispatched', 'Completed', 'Delivered', 'Dispatched'])
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};

import { supabase } from '../supabaseClient';

export const fetchDashboardData = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    // Start of current month
    const startOfMonth = new Date(year, month, 1).toISOString();
    // End of current day (for inclusive queries) or just today ISO
    const endOfToday = new Date().toISOString();

    try {
        // 1. Fetch Inventory Data (Active Products)
        const { data: inventoryData, error: inventoryError } = await supabase
            .from('production_products')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (inventoryError) throw inventoryError;

        // 2. Fetch Revenue (Completed Orders this month)
        const { data: revenueData, error: revenueError } = await supabase
            .from('emp_mar_orders')
            .select('total_price, created_at')
            .eq('status', 'completed')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfToday);

        if (revenueError) throw revenueError;

        // 3. Fetch Raw Material Usage (This month)
        const { data: usageData, error: usageError } = await supabase
            .from('pro_raw_material_usage')
            .select(`
        total_cost,
        raw_material_id,
        pro_inventory!inner(name)
      `)
            .gte('usage_date', startOfMonth)
            .lte('usage_date', endOfToday);

        if (usageError) throw usageError;

        // 4. Fetch Production Metrics (Today)
        const todayStr = new Date().toISOString().split('T')[0];

        // Production Logs (Sum quantity for today)
        const { data: productionData, error: productionError } = await supabase
            .from('pro_production_logs')
            .select('quantity_produced')
            .eq('production_date', todayStr);

        let todayProduction = 0;
        if (!productionError && productionData) {
            todayProduction = productionData.reduce((sum, log) => sum + (log.quantity_produced || 0), 0);
        }

        // Production Target (for today)
        const { data: targetData, error: targetError } = await supabase
            .from('pro_production_targets')
            .select('target_quantity')
            .eq('start_date', todayStr)
            .maybeSingle();

        const productionTarget = targetData?.target_quantity || 120; // Default 120

        // 5. Fetch Machine Status
        const { data: machinesData, error: machinesError } = await supabase
            .from('pro_machines')
            .select('id, status')
            .eq('is_active', true);

        let activeMachines = 0;
        let totalMachines = 15;

        if (!machinesError && machinesData) {
            totalMachines = machinesData.length || 15;
            activeMachines = machinesData.filter(m => m.status === 'running').length;
        }

        // 6. Quality Rate (Mocked)
        const qualityRate = 96.5;

        return {
            inventoryData,
            revenueData,
            usageData,
            quickStats: {
                todayProduction,
                productionTarget,
                activeMachines,
                totalMachines,
                qualityRate
            }
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
};

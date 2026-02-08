import { supabase } from '../../supabaseClient';

// Fetch all active products
export const getInventoryItems = async () => {
    try {
        const { data, error } = await supabase
            .from('production_products')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        return [];
    }
};

// Add a new product
export const addInventoryProduct = async (productData) => {
    try {
        // Basic validation
        if (!productData.name || !productData.category) {
            throw new Error('Name and Category are required');
        }

        const { data, error } = await supabase
            .from('production_products')
            .insert([{
                ...productData,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding inventory product:', error);
        throw error;
    }
};

// Update an existing product
export const updateInventoryProduct = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('production_products')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating inventory product:', error);
        throw error;
    }
};

// Soft delete a product (set is_active = false)
export const deleteInventoryProduct = async (id) => {
    try {
        const { error } = await supabase
            .from('production_products')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting inventory product:', error);
        throw error;
    }
};

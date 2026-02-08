import React, { useState, useEffect } from 'react';
import { getProducts, getProductSummary, getProductCategories } from '../../../services/supabase/productsService';
import Prod_InventoryHeader from './prod_InventoryHeader';
import Prod_SummaryCards from './prod_SummaryCards';
import Prod_InventoryTable from './prod_InventoryTable';

function Prod_InventoryScreen() {
    const [language, setLanguage] = useState('English');
    const [products, setProducts] = useState([]);
    const [productSummary, setProductSummary] = useState({ total: 0, byCategory: [] });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        product_type: '',
        search: ''
    });

    useEffect(() => {
        fetchProductsData();
    }, [filters]);

    const fetchProductsData = async () => {
        setLoading(true);
        try {
            const [productsData, summaryData, categoriesData] = await Promise.all([
                getProducts(filters),
                getProductSummary(),
                getProductCategories()
            ]);

            setProducts(productsData);
            setProductSummary(summaryData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    };

    const handleRefresh = () => {
        fetchProductsData();
    };

    return (
        <div className="inventory-web">
            <Prod_InventoryHeader
                language={language}
                setLanguage={setLanguage}
                onSearch={handleSearch}
                onRefresh={handleRefresh}
                categories={categories}
                onFilterChange={handleFilterChange}
                filters={filters}
            />

            <Prod_SummaryCards
                totalProducts={productSummary.total}
                categoryData={productSummary.byCategory}
                loading={loading}
            />

            <Prod_InventoryTable
                products={products}
                loading={loading}
                onRefresh={handleRefresh}
                language={language}
            />
        </div>
    );
}

export default Prod_InventoryScreen;

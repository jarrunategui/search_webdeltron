import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import { searchProducts, getProductDetails } from '../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRanges: [],
    features: []
  });
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    brands: [],
    priceRanges: [],
    features: []
  });

  // Handle search functionality
  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  // Fetch products when search term changes
  useEffect(() => {
    const currentSearchTerm = searchParams.get('q');
    if (currentSearchTerm) {
      setSearchTerm(currentSearchTerm);
      fetchProducts(currentSearchTerm);
    }
  }, [searchParams]);

  const fetchProducts = async (term) => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Get SKUs from search API
      console.log('Searching for:', term);
      const skus = await searchProducts(term);
      
      if (skus && skus.length > 0) {
        // Step 2: Get product details for each SKU
        console.log('Found SKUs:', skus);
        const productDetails = await getProductDetails(skus);
        
        setProducts(productDetails);
        updateFiltersFromProducts(productDetails);
      } else {
        setProducts([]);
        setFilters({
          categories: [],
          brands: [],
          priceRanges: [],
          features: []
        });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update filters based on current products
  const updateFiltersFromProducts = (productList) => {
    const categories = [...new Set(productList.map(p => p.category).filter(Boolean))];
    const brands = [...new Set(productList.map(p => p.brand).filter(Boolean))];
    const features = [...new Set(productList.flatMap(p => p.features || []))];
    
    // Generate price ranges based on product prices
    const prices = productList.map(p => p.price).filter(p => p && p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRanges = generatePriceRanges(minPrice, maxPrice);

    setFilters({
      categories: categories.map(cat => ({ name: cat, count: productList.filter(p => p.category === cat).length })),
      brands: brands.map(brand => ({ name: brand, count: productList.filter(p => p.brand === brand).length })),
      priceRanges,
      features: features.map(feature => ({ name: feature, count: productList.filter(p => p.features?.includes(feature)).length }))
    });
  };

  const generatePriceRanges = (min, max) => {
    if (!min || !max || min >= max) return [];
    
    const ranges = [];
    const step = Math.ceil((max - min) / 5);
    
    for (let i = 0; i < 5; i++) {
      const rangeMin = min + (step * i);
      const rangeMax = i === 4 ? max : min + (step * (i + 1));
      ranges.push({
        name: `$${rangeMin.toLocaleString()} - $${rangeMax.toLocaleString()}`,
        min: rangeMin,
        max: rangeMax,
        count: products.filter(p => p.price >= rangeMin && p.price <= rangeMax).length
      });
    }
    
    return ranges;
  };

  // Filter products based on active filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
      return false;
    }
    
    // Brand filter
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) {
      return false;
    }
    
    // Price range filter
    if (activeFilters.priceRanges.length > 0) {
      const matchesPriceRange = activeFilters.priceRanges.some(range => {
        const priceRange = filters.priceRanges.find(pr => pr.name === range);
        return priceRange && product.price >= priceRange.min && product.price <= priceRange.max;
      });
      if (!matchesPriceRange) return false;
    }
    
    // Features filter
    if (activeFilters.features.length > 0) {
      const hasFeature = activeFilters.features.some(feature => 
        product.features?.includes(feature)
      );
      if (!hasFeature) return false;
    }
    
    return true;
  });

  const handleFilterChange = (filterType, value, checked) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  return (
    <div className="search-page">
      <Header 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSearchTermChange={setSearchTerm}
      />
      
      <div className="main-content">
        <Sidebar 
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
        
        <div className="results-section">
          <div className="results-header">
            RESULTADO DE LA BÚSQUEDA: {searchTerm && `"${searchTerm}"`}
          </div>
          
          <ProductGrid 
            products={filteredProducts}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

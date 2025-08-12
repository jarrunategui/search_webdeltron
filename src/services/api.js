import axios from 'axios';

// Mock data for development - replace with real API endpoints
const MOCK_SKUS = [
  'TE-24155', 'TE-27535', 'TE-21265', 'ADV-21655', 'TE-27135', 
  'LG-24MS500', 'TE-27325', 'TE-32155', 'ADV-27505', 'LG-22MK410',
  'SAMSUNG-27', 'TE-32165'
];

const MOCK_PRODUCTS = {
  'TE-24155': {
    sku: 'TE-24155',
    title: 'Monitor plano TEROS TE-24155, 23.8" FHD IPS, HDMI, DP',
    brand: 'TEROS',
    price: 459.00,
    originalPrice: 520.00,
    discount: 12,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: > 100 und, Código: MON236TE24155, Min Código: 459462',
    stock: 150,
    stockStatus: 'Disponible',
    category: 'Monitores',
    features: ['FHD', 'IPS', 'HDMI', 'DisplayPort'],
    brandLogo: '/api/placeholder/40/20'
  },
  'TE-27535': {
    sku: 'TE-27535',
    title: 'Monitor plano gaming TEROS TE-27535, 27" 2K QHD IPS, 165 Hz, 1 ms, FHD',
    brand: 'TEROS',
    price: 799.00,
    originalPrice: 899.00,
    discount: 11,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: > 100 und, Código: MON27TE27535, Min Código: 466462',
    stock: 85,
    stockStatus: 'Disponible',
    category: 'Monitores Gaming',
    features: ['2K QHD', 'IPS', '165Hz', '1ms', 'Gaming'],
    brandLogo: '/api/placeholder/40/20'
  },
  'TE-21265': {
    sku: 'TE-21265',
    title: 'Monitor Teros TE-21265, 21.5" IPS, 100Hz, 1920x1080, Full HD, HDMI, VGA, VESA Compatible',
    brand: 'TEROS',
    price: 329.00,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: > 100 und, Código: MON21TE21265, Min Código: 481498',
    stock: 200,
    stockStatus: 'Disponible',
    category: 'Monitores',
    features: ['Full HD', 'IPS', '100Hz', 'HDMI', 'VGA', 'VESA'],
    brandLogo: '/api/placeholder/40/20'
  },
  'ADV-21655': {
    sku: 'ADV-21655',
    title: 'Monitor plano Advance ADV-21655, 21.5" IPS BOE, HDMI, DP, VGA, Parlantes',
    brand: 'ADVANCE',
    price: 399.00,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: 4, Código: MON21ADV21655, Min Código: 481647',
    stock: 4,
    stockStatus: 'Poco Stock',
    category: 'Monitores',
    features: ['IPS', 'BOE', 'HDMI', 'DisplayPort', 'VGA', 'Parlantes'],
    brandLogo: '/api/placeholder/40/20'
  },
  'LG-24MS500': {
    sku: 'LG-24MS500',
    title: 'Monitor LG 24MS500-B, 23.8" FHD IPS (1920x1080), HDMI x2 / Headphone Out 3.5',
    brand: 'LG',
    price: 549.00,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: > 100 und, Código: MON24LG24MS500, Min Código: 24MS500',
    stock: 120,
    stockStatus: 'Disponible',
    category: 'Monitores',
    features: ['FHD', 'IPS', 'HDMI', 'Headphone Out'],
    brandLogo: '/api/placeholder/40/20'
  },
  'SAMSUNG-27': {
    sku: 'SAMSUNG-27',
    title: 'Monitor Samsung 27" ViewFinity S6, QHD (2560x1440), IPS, HDMI/DP/HP, OUTPORTS 3.5',
    brand: 'SAMSUNG',
    price: 899.00,
    image: '/api/placeholder/280/180',
    specifications: 'Stock Disponible: 4, Código: MON27SAMSUNG27, Min Código: LS27A600NSLXPE',
    stock: 4,
    stockStatus: 'Poco Stock',
    category: 'Monitores',
    features: ['QHD', 'IPS', 'HDMI', 'DisplayPort', 'ViewFinity'],
    brandLogo: '/api/placeholder/40/20'
  }
};

// API Configuration - Replace these with your actual API endpoints
const API_CONFIG = {
  SEARCH_API_URL: process.env.REACT_APP_SEARCH_API_URL || 'https://api.example.com/search',
  PRODUCTS_API_URL: process.env.REACT_APP_PRODUCTS_API_URL || 'https://api.example.com/products',
  API_KEY: process.env.REACT_APP_API_KEY || ''
};

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_CONFIG.API_KEY && { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` })
  }
});

/**
 * Search for products and return array of SKUs
 * @param {string} searchTerm - The search term
 * @returns {Promise<string[]>} Array of product SKUs
 */
export const searchProducts = async (searchTerm) => {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development' || !API_CONFIG.SEARCH_API_URL.includes('api.example.com') === false) {
      console.log('Using mock search data for term:', searchTerm);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock SKUs based on search term
      const filteredSkus = MOCK_SKUS.filter(sku => 
        sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes('monitor') ||
        searchTerm.toLowerCase().includes('teros') ||
        searchTerm.toLowerCase().includes('lg') ||
        searchTerm.toLowerCase().includes('samsung')
      );
      
      return filteredSkus.length > 0 ? filteredSkus : MOCK_SKUS.slice(0, 6);
    }

    // Real API call
    const response = await apiClient.post(API_CONFIG.SEARCH_API_URL, {
      query: searchTerm,
      limit: 50
    });

    return response.data.skus || response.data.products || response.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    
    // Fallback to mock data on error
    console.log('Falling back to mock data due to API error');
    return MOCK_SKUS.slice(0, 6);
  }
};

/**
 * Get detailed product information for array of SKUs
 * @param {string[]} skus - Array of product SKUs
 * @returns {Promise<Object[]>} Array of detailed product objects
 */
export const getProductDetails = async (skus) => {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development' || !API_CONFIG.PRODUCTS_API_URL.includes('api.example.com') === false) {
      console.log('Using mock product details for SKUs:', skus);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock product details for the requested SKUs
      const products = skus.map(sku => MOCK_PRODUCTS[sku]).filter(Boolean);
      
      // If no products found, return some default products
      if (products.length === 0) {
        return Object.values(MOCK_PRODUCTS).slice(0, 6);
      }
      
      return products;
    }

    // Real API call
    const response = await apiClient.post(API_CONFIG.PRODUCTS_API_URL, {
      skus: skus,
      includeDetails: true
    });

    return response.data.products || response.data || [];
  } catch (error) {
    console.error('Error fetching product details:', error);
    
    // Fallback to mock data on error
    console.log('Falling back to mock product data due to API error');
    const products = skus.map(sku => MOCK_PRODUCTS[sku]).filter(Boolean);
    return products.length > 0 ? products : Object.values(MOCK_PRODUCTS).slice(0, 6);
  }
};

/**
 * Get product details for a single SKU
 * @param {string} sku - Product SKU
 * @returns {Promise<Object>} Detailed product object
 */
export const getProductDetail = async (sku) => {
  const products = await getProductDetails([sku]);
  return products[0] || null;
};

export default {
  searchProducts,
  getProductDetails,
  getProductDetail
};

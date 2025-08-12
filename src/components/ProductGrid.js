import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, searchTerm }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (loading) {
    return (
      <div className="loading">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!searchTerm) {
    return (
      <div className="no-results">
        Ingresa un término de búsqueda para ver los productos.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-results">
        No se encontraron productos para "{searchTerm}".
      </div>
    );
  }

  return (
    <div className={`results-grid ${isMobile ? 'mobile' : ''}`}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.sku || index} 
          product={product} 
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

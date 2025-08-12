import React from 'react';

const ProductCard = ({ product, isMobile }) => {
  const {
    sku,
    title,
    brand,
    price,
    originalPrice,
    image,
    specifications,
    stock,
    stockStatus,
    brandLogo,
    discount
  } = product;

  const formatPrice = (price) => {
    if (!price) return '';
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const getStockDisplay = () => {
    if (stock !== undefined && stock !== null) {
      return stock > 0 ? `Stock Disponible: ${stock} und` : 'Sin Stock';
    }
    return stockStatus || 'Consultar disponibilidad';
  };

  const getStockColor = () => {
    if (stock !== undefined && stock !== null) {
      return stock > 0 ? '#27ae60' : '#e74c3c';
    }
    return '#f39c12';
  };

  return (
    <div className={`product-card ${isMobile ? 'mobile' : ''}`}>
      {discount && (
        <div className="price-badge">
          -{discount}%
        </div>
      )}
      
      {brandLogo && (
        <img 
          src={brandLogo} 
          alt={brand} 
          className="brand-logo"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="product-image-container">
        <img
          src={image || '/placeholder-product.jpg'}
          alt={title}
          className="product-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjhGOEY4Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTYwVjEyMEgxMjBWODBaIiBmaWxsPSIjRDBEMEQwIi8+CjxwYXRoIGQ9Ik0xMzAgOTBIMTUwVjExMEgxMzBWOTBaIiBmaWxsPSIjQjBCMEIwIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
          }}
        />
      </div>

      <div className="product-info">
        {brand && (
          <div className="product-brand">{brand}</div>
        )}
        
        <div className="product-title">
          {title || 'Producto sin título'}
        </div>
        
        {specifications && (
          <div className="product-specs">
            {specifications}
          </div>
        )}
        
        <div className="product-pricing">
          {originalPrice && originalPrice > price && (
            <div className="original-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
              {formatPrice(originalPrice)}
            </div>
          )}
          <div className="product-price">
            {formatPrice(price)}
          </div>
        </div>
        
        <div className="product-stock" style={{ color: getStockColor() }}>
          {getStockDisplay()}
        </div>
        
        {sku && (
          <div className="product-code">
            Código: {sku}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

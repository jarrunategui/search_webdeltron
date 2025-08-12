import React, { useState, useEffect } from 'react';

const Sidebar = ({ filters, activeFilters, onFilterChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsFiltersVisible(true);
      } else {
        setIsFiltersVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
  const renderFilterSection = (title, filterType, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="filter-section">
        <div className="filter-title">{title}</div>
        {items.map((item, index) => (
          <div key={index} className="filter-item">
            <input
              type="checkbox"
              id={`${filterType}-${index}`}
              checked={activeFilters[filterType].includes(item.name)}
              onChange={(e) => onFilterChange(filterType, item.name, e.target.checked)}
            />
            <label htmlFor={`${filterType}-${index}`}>
              {item.name} {item.count && `(${item.count})`}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {isMobile && (
        <button 
          className="mobile-filter-toggle" 
          onClick={toggleFilters}
        >
          <span>Filtros</span>
          <span className={`filter-toggle-icon ${isFiltersVisible ? 'open' : ''}`}>
            ▼
          </span>
        </button>
      )}
      
      <div className={`sidebar ${isMobile && !isFiltersVisible ? 'mobile-hidden' : ''}`}>
        {renderFilterSection('CATEGORÍA', 'categories', filters.categories)}
      {renderFilterSection('MARCA', 'brands', filters.brands)}
      {renderFilterSection('RANGO DE PRECIO', 'priceRanges', filters.priceRanges)}
      {renderFilterSection('CARACTERÍSTICAS', 'features', filters.features)}
      
      {/* Static sections that appear in the original design */}
      <div className="filter-section">
        <div className="filter-title">DIGITAL SIGNAGE</div>
        <div className="filter-item">
          <input type="checkbox" id="digital-signage" />
          <label htmlFor="digital-signage">Pantallas digitales</label>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">ALMACÉN</div>
        <div className="filter-item">
          <input type="checkbox" id="lima-personal" />
          <label htmlFor="lima-personal">Lima Personal</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="lima-sucursal" />
          <label htmlFor="lima-sucursal">Lima Sucursal</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="provincias" />
          <label htmlFor="provincias">Provincias</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="chiclayo" />
          <label htmlFor="chiclayo">Chiclayo</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="trujillo" />
          <label htmlFor="trujillo">Trujillo</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="arequipa" />
          <label htmlFor="arequipa">Arequipa</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="huancayo" />
          <label htmlFor="huancayo">Huancayo</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="iquitos" />
          <label htmlFor="iquitos">Iquitos</label>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">STOCK</div>
        <div className="filter-item">
          <input type="checkbox" id="stock-disponible" />
          <label htmlFor="stock-disponible">Stock Disponible</label>
        </div>
        <div className="filter-item">
          <input type="checkbox" id="sin-disponible" />
          <label htmlFor="sin-disponible">Sin Disponible</label>
        </div>
      </div>

        <div className="filter-section">
          <button className="filter-details-btn">
            Usar IA para detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

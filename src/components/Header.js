import React from 'react';

const Header = ({ searchTerm, onSearch, onSearchTermChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    onSearchTermChange(e.target.value);
  };

  return (
    <header className="header">
      <a href="/" className="logo">
        Deltron
      </a>
      
      <form className="search-container" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
      
      <div className="header-actions">
        <span className="category-label">CATEGORÍA</span>
      </div>
    </header>
  );
};

export default Header;

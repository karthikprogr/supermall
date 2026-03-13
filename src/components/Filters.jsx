import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Filters = ({ filters, onFilterChange, mode = 'default' }) => {
  const {
    category,
    floor,
    searchTerm,
    minPrice = '',
    maxPrice = '',
    sortBy = 'relevance',
    hasOfferOnly = false
  } = filters;
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const isProductMode = mode === 'products';

  useEffect(() => {
    if (mode !== 'offers') {
      fetchCategoriesAndFloors();
    }
  }, [mode]);

  const fetchCategoriesAndFloors = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesData);

      const floorsSnapshot = await getDocs(collection(db, 'floors'));
      const floorsData = floorsSnapshot.docs.map(doc => doc.data().name);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search shops or products..."
          value={searchTerm}
          onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="select-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Floor</label>
        <select
          value={floor}
          onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
          className="select-field"
        >
          <option value="">All Floors</option>
          {floors.map((flr, index) => (
            <option key={index} value={flr}>{flr}</option>
          ))}
        </select>
      </div>

      {isProductMode && (
        <>
          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={minPrice}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="select-field"
            >
              <option value="relevance">Relevance</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="offerHighLow">Best Discount</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="filter-group filter-checkbox-row">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={hasOfferOnly}
                onChange={(e) => onFilterChange({ ...filters, hasOfferOnly: e.target.checked })}
              />
              Show products with active offers only
            </label>
          </div>
        </>
      )}

      <button 
        onClick={() =>
          onFilterChange({
            ...filters,
            category: '',
            floor: '',
            searchTerm: '',
            ...(isProductMode
              ? {
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'relevance',
                  hasOfferOnly: false
                }
              : {})
          })
        }
        className="btn btn-secondary"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;

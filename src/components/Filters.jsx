import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Filters = ({ filters, onFilterChange }) => {
  const { category, floor, searchTerm } = filters;
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    fetchCategoriesAndFloors();
  }, []);

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

      <button 
        onClick={() => onFilterChange({ category: '', floor: '', searchTerm: '' })}
        className="btn btn-secondary"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;

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
    <div className="glass-card filters-container" style={{padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center'}}>
      <div className="filter-group" style={{flex: '1', minWidth: '200px'}}>
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Search
        </label>
        <div style={{position: 'relative'}}>
          <input
            type="text"
            placeholder="Name or brand..."
            value={searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            className="filter-input"
            style={{width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff'}}
          />
        </div>
      </div>

      <div className="filter-group" style={{minWidth: '160px'}}>
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 21v-7m0-4V3m8 21v-9m0-5V3m8 21v-2m0-4V3M1 14h6m2-6h6m2 8h6"/>
          </svg>
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="select-field"
          style={{width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff'}}
        >
          <option value="" style={{background: '#0f172a'}}>All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat} style={{background: '#0f172a'}}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group" style={{minWidth: '140px'}}>
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
          Floor
        </label>
        <select
          value={floor}
          onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
          className="select-field"
          style={{width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff'}}
        >
          <option value="" style={{background: '#0f172a'}}>All Floors</option>
          {floors.map((flr, index) => (
            <option key={index} value={flr} style={{background: '#0f172a'}}>{flr}</option>
          ))}
        </select>
      </div>

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
        className="btn"
        style={{padding: '0.8rem 1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.8rem', marginTop: '1.25rem'}}
      >
        Reset Filters
      </button>
    </div>

  );
};

export default Filters;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import ShopCard from '../../components/ShopCard';
import Filters from '../../components/Filters';
import AsyncState from '../../components/AsyncState';

const UserShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    floor: '',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectedMall } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMall) {
      navigate('/user/malls');
      return;
    }
    fetchShops();
  }, [selectedMall, navigate]);

  useEffect(() => {
    applyFilters();
  }, [filters, shops]);

  const fetchShops = async () => {
    try {
      setError('');
      setLoading(true);
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShops(shopsData);
      setFilteredShops(shopsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Unable to load shops for this mall. Please retry.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...shops];

    if (filters.category) {
      filtered = filtered.filter(shop => shop.category === filters.category);
    }

    if (filters.floor) {
      filtered = filtered.filter(shop => shop.floor === filters.floor);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(shop =>
        shop.shopName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (shop.description && shop.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    setFilteredShops(filtered);
  };

  if (loading) {
    return <div className="loading">Loading shops...</div>;
  }

  return (
    <div className="mall-selection-page">
      <div className="page-header" style={{marginBottom: '3rem', position: 'relative'}}>
        <button 
          className="btn-ghost" 
          onClick={() => navigate('/user/malls')}
          style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Malls
        </button>
        <h1 className="primary-gradient-text" style={{fontSize: '3rem', marginBottom: '0.5rem'}}>{selectedMall?.mallName || 'Browse Shops'}</h1>
        <p className="subtitle" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {selectedMall?.location} • {shops.length} Active Shops
        </p>
      </div>
      
      <Filters filters={filters} onFilterChange={setFilters} />


      {error && (
        <AsyncState
          title="Could not fetch shops"
          message={error}
          actionLabel="Retry loading shops"
          onAction={fetchShops}
        />
      )}

      <div className="results-info">
        <p>Showing {filteredShops.length} of {shops.length} shops</p>
      </div>

      <div className="malls-grid">
        {!error && filteredShops.length === 0 ? (
          <p className="empty-message">No shops found matching your filters</p>
        ) : (
          filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} viewLink="/user/products" />
          ))
        )}
      </div>

    </div>
  );
};

export default UserShops;

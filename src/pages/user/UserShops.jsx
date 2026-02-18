import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import ShopCard from '../../components/ShopCard';
import Filters from '../../components/Filters';

const UserShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    floor: '',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(true);
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
    <div className="page-container">
      <div className="page-header">
        <h1>{selectedMall?.name || 'Browse Shops'}</h1>
        <p className="subtitle">
          {selectedMall?.location ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedMall.location}
            </>
          ) : 'Discover shops across the mall'}
        </p>
      </div>
      <button 
        className="btn btn-sm btn-secondary" 
        onClick={() => navigate('/user/malls')}
        style={{marginBottom: '1.5rem', alignSelf: 'flex-start'}}
      >
        Change Mall
      </button>
      
      <Filters filters={filters} onFilterChange={setFilters} />

      <div className="results-info">
        <p>Showing {filteredShops.length} of {shops.length} shops</p>
      </div>

      <div className="cards-grid">
        {filteredShops.length === 0 ? (
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

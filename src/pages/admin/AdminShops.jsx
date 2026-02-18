import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import ShopCard from '../../components/ShopCard';
import Filters from '../../components/Filters';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    floor: '',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, shops]);

  const fetchShops = async () => {
    try {
      const shopsSnapshot = await getDocs(collection(db, 'shops'));
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
        shop.shopName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredShops(filtered);
  };

  const handleDelete = async (shopId, shopName) => {
    if (!window.confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'shops', shopId));
      setShops(shops.filter(shop => shop.id !== shopId));
      alert('Shop deleted successfully!');
    } catch (error) {
      console.error('Error deleting shop:', error);
      alert('Failed to delete shop: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading shops...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Shops</h1>
        <button 
          onClick={() => navigate('/admin/create-shop')} 
          className="btn btn-success"
        >
          + Create New Shop
        </button>
      </div>
      
      <Filters filters={filters} onFilterChange={setFilters} />

      <div className="cards-grid">
        {filteredShops.length === 0 ? (
          <p className="empty-message">No shops found</p>
        ) : (
          filteredShops.map(shop => (
            <div key={shop.id} className="shop-card-wrapper">
              <ShopCard shop={shop} />
              <div className="card-actions">
                <button
                  onClick={() => navigate(`/admin/edit-shop/${shop.id}`)}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(shop.id, shop.shopName)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminShops;

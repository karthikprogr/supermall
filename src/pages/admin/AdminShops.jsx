import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import ShopCard from '../../components/ShopCard';
import Filters from '../../components/Filters';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filters, setFilters] = useState({ category: '', floor: '', searchTerm: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchShops(); }, []);
  useEffect(() => { applyFilters(); }, [filters, shops]);

  const fetchShops = async () => {
    try {
      const shopsSnapshot = await getDocs(collection(db, 'shops'));
      const shopsData = shopsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    if (filters.category) filtered = filtered.filter(shop => shop.category === filters.category);
    if (filters.floor) filtered = filtered.filter(shop => shop.floor === filters.floor);
    if (filters.searchTerm) filtered = filtered.filter(shop => shop.shopName.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    setFilteredShops(filtered);
  };

  const handleDelete = async (shopId, shopName) => {
    if (!window.confirm(`Are you sure you want to delete "${shopName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'shops', shopId));
      setShops(shops.filter(shop => shop.id !== shopId));
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  if (loading) return <div className="loading">Loading shop directory...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
        <div>
          <h1 className="primary-gradient-text">Retail Inventory</h1>
          <p className="subtitle" style={{marginTop: '0.5rem'}}>Monitor storefront health and performance across the ecosystem</p>
        </div>
      </div>
      
      <div style={{marginBottom: '5rem'}}>
        <Filters filters={filters} onFilterChange={setFilters} />
      </div>

      {filteredShops.length === 0 ? (
        <div className="empty-state glass-card section-padding text-center">
          <h2>No Matching Shops Found</h2>
          <p style={{marginTop: '1rem', color: 'var(--text-dim)'}}>Refine your filters or onboard new merchants to expand the retail directory.</p>
        </div>
      ) : (
        <div className="admin-data-grid">
          {filteredShops.map(shop => (
            <div key={shop.id} className="admin-data-card glass-card">
              <div style={{transform: 'scale(1.02)', margin: '-0.5rem'}}>
                <ShopCard shop={shop} />
              </div>
              <div className="data-actions" style={{marginTop: '2rem'}}>
                <button onClick={() => navigate(`/admin/view-shop/${shop.id}`)} className="btn btn-sm" style={{flex: 1}}>
                  Inside View
                </button>
                <div style={{display: 'flex', gap: '0.5rem', flex: 1.5}}>
                  <button onClick={() => navigate(`/admin/edit-shop/${shop.id}`)} className="btn btn-sm btn-primary" style={{flex: 1}}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(shop.id, shop.shopName)} className="btn btn-sm btn-danger" style={{flex: 1, padding: '0.5rem'}}>
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminShops;

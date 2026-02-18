import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';

const UserDashboard = () => {
  const { selectedMall, clearMallSelection } = useUserContext();
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    activeOffers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ shops: [], products: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMall) {
      navigate('/user/malls');
    } else {
      fetchData();
    }
  }, [selectedMall, navigate]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch();
    } else {
      setShowSearchResults(false);
      setSearchResults({ shops: [], products: [] });
    }
  }, [searchTerm]);

  const performSearch = async () => {
    try {
      // Search shops
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shops = shopsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(shop => 
          shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (shop.category && shop.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      // Search products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => {
          const shopIds = shopsSnapshot.docs.map(doc => doc.id);
          return shopIds.includes(product.shopId) && (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.features && product.features.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

      setSearchResults({ shops, products });
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch shops in selected mall
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);

      // Fetch all products from shops in this mall
      let totalProducts = 0;
      let totalOffers = 0;

      for (const shopDoc of shopsSnapshot.docs) {
        const productsQuery = query(
          collection(db, 'products'),
          where('shopId', '==', shopDoc.id)
        );
        const productsSnapshot = await getDocs(productsQuery);
        totalProducts += productsSnapshot.size;

        // Count offers for these products
        for (const productDoc of productsSnapshot.docs) {
          const offersQuery = query(
            collection(db, 'offers'),
            where('productId', '==', productDoc.id)
          );
          const offersSnapshot = await getDocs(offersQuery);
          totalOffers += offersSnapshot.size;
        }
      }

      setStats({
        totalShops: shopsSnapshot.size,
        totalProducts,
        activeOffers: totalOffers
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (!selectedMall) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="mall-header">
        <h1>{selectedMall.name}</h1>
        {selectedMall.location && (
          <p className="mall-location-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {selectedMall.location}
          </p>
        )}
        <button 
          onClick={() => clearMallSelection()}
          className="btn btn-secondary btn-sm"
        >
          Change Mall
        </button>
      </div>

      <p className="subtitle">Explore shops, products, and amazing deals</p>

      {/* Universal Search Bar */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Search Shops & Products</label>
          <input
            type="text"
            placeholder="Search for shops or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div className="search-results-container">
          <h3>Search Results</h3>
          
          {searchResults.shops.length > 0 && (
            <div className="search-section">
              <h4>Shops ({searchResults.shops.length})</h4>
              <div className="search-items">
                {searchResults.shops.map(shop => (
                  <div key={shop.id} className="search-item" onClick={() => navigate('/user/shops')}>
                    <strong>{shop.shopName}</strong>
                    <span>{shop.category} - {shop.floor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.products.length > 0 && (
            <div className="search-section">
              <h4>Products ({searchResults.products.length})</h4>
              <div className="search-items">
                {searchResults.products.map(product => (
                  <div key={product.id} className="search-item" onClick={() => navigate('/user/products')}>
                    <strong>{product.name}</strong>
                    <span>₹{product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.shops.length === 0 && searchResults.products.length === 0 && (
            <p className="empty-message">No results found for "{searchTerm}"</p>
          )}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalShops}</h3>
          <p>Shops</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalProducts}</h3>
          <p>Products</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeOffers}</h3>
          <p>Active Offers</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Explore & Discover</h2>
        <div className="quick-links">
          <Link to="/user/shops" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div className="link-title">Browse Shops</div>
              <small>All shops by floor</small>
            </div>
          </Link>

          <Link to="/user/products" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="9" y1="21" x2="9" y2="3"/>
                <line x1="15" y1="21" x2="15" y2="3"/>
                <path d="M3 9h18"/>
                <path d="M3 15h18"/>
              </svg>
            </div>
            <div>
              <div className="link-title">View Products</div>
              <small>Browse by category</small>
            </div>
          </Link>

          <Link to="/user/offers" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M9 9h6v6H9z"/>
              </svg>
            </div>
            <div>
              <div className="link-title">Check Offers</div>
              <small>Latest deals & discounts</small>
            </div>
          </Link>

          <Link to="/user/compare" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"/>
                <line x1="12" y1="12" x2="20" y2="7.5"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <line x1="12" y1="12" x2="4" y2="7.5"/>
              </svg>
            </div>
            <div>
              <div className="link-title">Compare Products</div>
              <small>Compare price & features</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

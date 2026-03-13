import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import AsyncState from '../../components/AsyncState';

const UserDashboard = () => {
  const { selectedMall, clearMallSelection } = useUserContext();
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    activeOffers: 0,
    avgProductPrice: 0
  });
  const [topOffers, setTopOffers] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ shops: [], products: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setError('');
      setLoading(true);
      // Fetch shops in selected mall
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopIds = shopsSnapshot.docs.map((doc) => doc.id);

      // Fetch all products once and filter by selected mall shops
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productList = productsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => shopIds.includes(product.shopId));

      // Fetch all offers once and map by productId
      const offersSnapshot = await getDocs(collection(db, 'offers'));
      const offersList = offersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((offer) => productList.some((product) => product.id === offer.productId));

      const offersByProduct = new Map();
      offersList.forEach((offer) => {
        offersByProduct.set(offer.productId, offer);
      });

      const productsWithOffers = productList.map((product) => ({
        ...product,
        offer: offersByProduct.get(product.id) || null
      }));

      // Category insights
      const categoryCounter = {};
      productsWithOffers.forEach((product) => {
        const categoryName = product.category || 'Others';
        categoryCounter[categoryName] = (categoryCounter[categoryName] || 0) + 1;
      });

      const categoryInsights = Object.entries(categoryCounter)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

      // Top deals and recently added products
      const bestDeals = productsWithOffers
        .filter((product) => Boolean(product.offer))
        .sort((a, b) => (b.offer?.discount || 0) - (a.offer?.discount || 0))
        .slice(0, 3);

      const recent = [...productsWithOffers]
        .sort((a, b) => {
          const aTime = typeof a.createdAt?.seconds === 'number' ? a.createdAt.seconds : 0;
          const bTime = typeof b.createdAt?.seconds === 'number' ? b.createdAt.seconds : 0;
          return bTime - aTime;
        })
        .slice(0, 4);

      const totalPrice = productsWithOffers.reduce((sum, product) => sum + (Number(product.price) || 0), 0);
      const averagePrice = productsWithOffers.length ? Math.round(totalPrice / productsWithOffers.length) : 0;

      setStats({
        totalShops: shopsSnapshot.size,
        totalProducts: productsWithOffers.length,
        activeOffers: offersList.length,
        avgProductPrice: averagePrice
      });
      setTopCategories(categoryInsights);
      setTopOffers(bestDeals);
      setRecentProducts(recent);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to load dashboard insights. Please retry.');
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
    <div className="dashboard-page user-marketplace-page">
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
          className="btn btn-secondary btn-sm marketplace-back-btn"
        >
          Change Mall
        </button>
      </div>

      <p className="subtitle">Explore shops, products, and amazing deals</p>

      <div className="user-highlight-strip">
        <div className="highlight-chip">Smart search enabled</div>
        <div className="highlight-chip">Top deals curated</div>
        <div className="highlight-chip">Live mall insights</div>
      </div>

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

      {error && (
        <AsyncState
          title="Could not load dashboard"
          message={error}
          actionLabel="Retry loading dashboard"
          onAction={fetchData}
        />
      )}

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

      {!error && <div className="stats-grid">
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
        <div className="stat-card">
          <h3>₹{stats.avgProductPrice}</h3>
          <p>Avg Product Price</p>
        </div>
      </div>}

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

          <Link to="/user/saved" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div className="link-title">Saved Items</div>
              <small>Your shortlisted products</small>
            </div>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Top Deals for You</h2>
        {topOffers.length === 0 ? (
          <p className="empty-message">No active deals right now. Check back soon.</p>
        ) : (
          <div className="insights-grid">
            {topOffers.map((product) => {
              const discount = Number(product.offer?.discount || 0);
              const basePrice = Number(product.price || 0);
              const discountedPrice = Math.max(0, basePrice - (basePrice * discount) / 100);

              return (
                <div key={product.id} className="insight-card deal-card" onClick={() => navigate('/user/offers')}>
                  <div className="deal-discount-badge">{discount}% OFF</div>
                  <h3>{product.name}</h3>
                  <p className="deal-pricing">
                    <span className="price-old">₹{basePrice}</span>
                    <span className="price-new">₹{discountedPrice.toFixed(0)}</span>
                  </p>
                  <p className="deal-meta">{product.category || 'Category unavailable'}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="dashboard-split-layout">
        <div className="dashboard-section compact">
          <h2>Top Categories</h2>
          {topCategories.length === 0 ? (
            <p className="empty-message">No category insights yet.</p>
          ) : (
            <div className="category-bars">
              {topCategories.map((item) => {
                const maxCount = topCategories[0]?.count || 1;
                const widthPercent = Math.max(15, Math.round((item.count / maxCount) * 100));

                return (
                  <div key={item.name} className="category-row">
                    <div className="category-row-head">
                      <span>{item.name}</span>
                      <strong>{item.count}</strong>
                    </div>
                    <div className="category-track">
                      <div className="category-fill" style={{ width: `${widthPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-section compact">
          <h2>Recently Added Products</h2>
          {recentProducts.length === 0 ? (
            <p className="empty-message">No recent products found.</p>
          ) : (
            <div className="recent-list">
              {recentProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  className="recent-item"
                  onClick={() => navigate('/user/products')}
                >
                  <span className="recent-name">{product.name}</span>
                  <span className="recent-price">₹{Number(product.price || 0)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

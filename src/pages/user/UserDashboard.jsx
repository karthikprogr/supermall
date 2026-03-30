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
      <div className="mall-header glass-card" style={{padding: '2rem', marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 className="gradient-text">{selectedMall.name}</h1>
            {selectedMall.location && (
              <p className="mall-location-text" style={{marginTop: '0.5rem', opacity: 0.8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {selectedMall.location}
              </p>
            )}
          </div>
          <button 
            onClick={() => clearMallSelection()}
            className="btn btn-secondary btn-sm"
          >
            Change Mall
          </button>
        </div>
      </div>

      <div className="user-highlight-strip" style={{display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
        <span className="badge">Smart search enabled</span>
        <span className="badge">Top deals curated</span>
        <span className="badge">Live mall insights</span>
      </div>

      {/* Universal Search Bar */}
      <div className="filters-container glass-card">
        <div className="filter-group" style={{width: '100%'}}>
          <label style={{marginBottom: '0.75rem', display: 'block'}}>Live Search</label>
          <input
            type="text"
            placeholder="Search for shops, brands or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{background: 'rgba(255,255,255,0.05)'}}
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
        <div className="search-results-container glass-card" style={{padding: '2rem', marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1.5rem'}}>Search Results</h3>
          
          <div className="dashboard-grid" style={{margin: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
            {searchResults.shops.length > 0 && (
              <div className="search-section">
                <h4 className="gradient-text" style={{marginBottom: '1rem'}}>Shops</h4>
                <div className="search-items" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {searchResults.shops.map(shop => (
                    <div key={shop.id} className="glass-card" style={{padding: '1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)'}} onClick={() => navigate('/user/shops')}>
                      <strong>{shop.shopName}</strong>
                      <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)'}}>{shop.category} • {shop.floor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.products.length > 0 && (
              <div className="search-section">
                <h4 className="gradient-text" style={{marginBottom: '1rem'}}>Products</h4>
                <div className="search-items" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {searchResults.products.map(product => (
                    <div key={product.id} className="glass-card" style={{padding: '1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)'}} onClick={() => navigate('/user/products')}>
                      <strong>{product.name}</strong>
                      <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-main)'}}>₹{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {searchResults.shops.length === 0 && searchResults.products.length === 0 && (
            <p className="empty-state">No results found for "{searchTerm}"</p>
          )}
        </div>
      )}

      {!error && (
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.totalShops}</div>
            <p>Total Shops</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.totalProducts}</div>
            <p>Products</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.activeOffers}</div>
            <p>Active Offers</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">₹{stats.avgProductPrice}</div>
            <p>Avg Price</p>
          </div>
        </div>
      )}

      <div className="dashboard-section" style={{marginTop: '4rem'}}>
        <h2 className="section-title" style={{textAlign: 'left', fontSize: '1.75rem', marginBottom: '2rem'}}>Explore Marketplace</h2>
        <div className="cards-grid" style={{marginTop: 0}}>
          <Link to="/user/shops" className="card glass-card" style={{padding: '1.5rem', textDecoration: 'none'}}>
            <div style={{width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h4 style={{color: 'white'}}>Browse Shops</h4>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>Find your favorite stores by floor</p>
          </Link>

          <Link to="/user/products" className="card glass-card" style={{padding: '1.5rem', textDecoration: 'none'}}>
            <div style={{width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="9" y1="21" x2="9" y2="3"/><line x1="15" y1="21" x2="15" y2="3"/><path d="M3 9h18"/><path d="M3 15h18"/>
              </svg>
            </div>
            <h4 style={{color: 'white'}}>View Products</h4>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>Browse all commodities by category</p>
          </Link>

          <Link to="/user/offers" className="card glass-card" style={{padding: '1.5rem', textDecoration: 'none'}}>
            <div style={{width: '48px', height: '48px', background: 'var(--warning)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 9h6v6H9z"/>
              </svg>
            </div>
            <h4 style={{color: 'white'}}>Check Offers</h4>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>Exclusive deals and discounts</p>
          </Link>

          <Link to="/user/compare" className="card glass-card" style={{padding: '1.5rem', textDecoration: 'none'}}>
            <div style={{width: '48px', height: '48px', background: 'var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"/><line x1="12" y1="12" x2="20" y2="7.5"/><line x1="12" y1="12" x2="12" y2="21"/><line x1="12" y1="12" x2="4" y2="7.5"/>
              </svg>
            </div>
            <h4 style={{color: 'white'}}>Compare Items</h4>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>Compare features & marketplace costs</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section glass-card" style={{padding: '2rem'}}>
          <h2 style={{marginBottom: '2rem'}}>Top Deals for You</h2>
          {topOffers.length === 0 ? (
            <p className="empty-state">No active deals found.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {topOffers.map((product) => {
                const discount = Number(product.offer?.discount || 0);
                const basePrice = Number(product.price || 0);
                const discountedPrice = Math.max(0, basePrice - (basePrice * discount) / 100);

                return (
                  <div key={product.id} className="glass-card" style={{padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', cursor: 'pointer'}} onClick={() => navigate('/user/offers')}>
                    <div>
                      <span className="badge" style={{background: 'var(--accent)', borderColor: 'var(--accent)', marginBottom: '0.5rem'}}>{discount}% OFF</span>
                      <h4 style={{marginTop: '0.5rem'}}>{product.name}</h4>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem'}}>₹{basePrice}</div>
                      <div style={{fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)'}}>₹{discountedPrice.toFixed(0)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-section glass-card" style={{padding: '2rem'}}>
          <h2 style={{marginBottom: '2rem'}}>Popular Categories</h2>
          <div className="category-bars" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {topCategories.map((item) => {
              const maxCount = topCategories[0]?.count || 1;
              const widthPercent = Math.max(15, Math.round((item.count / maxCount) * 100));

              return (
                <div key={item.name} className="category-row">
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span>{item.name}</span>
                    <strong style={{color: 'var(--primary)'}}>{item.count} items</strong>
                  </div>
                  <div className="category-track" style={{height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'}}>
                    <div className="category-fill" style={{ width: `${widthPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

  );
};

export default UserDashboard;

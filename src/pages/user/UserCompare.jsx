import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';

const UserCompare = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedMall } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMall) {
      navigate('/user/malls');
      return;
    }
    fetchProducts();
  }, [selectedMall, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.shopName && product.shopName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopIds = shopsSnapshot.docs.map(doc => doc.id);

      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs
        .filter(doc => shopIds.includes(doc.data().shopId))
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          if (product.shopId) {
            const shop = shopsSnapshot.docs.find(doc => doc.id === product.shopId);
            if (shop) {
              product.shopName = shop.data().shopName;
              product.category = shop.data().category;
              product.floor = shop.data().floor;
            }
          }

          const offersSnapshot = await getDocs(collection(db, 'offers'));
          const offer = offersSnapshot.docs.find(doc => doc.data().productId === product.id);
          if (offer) {
            product.offer = offer.data();
          }

          return product;
        })
      );

      setProducts(productsWithDetails);
      setFilteredProducts(productsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddToCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, product]);
    } else {
      alert('You can compare up to 4 products at a time');
    }
  };

  const isInCompareList = (productId) => {
    return compareList.some(p => p.id === productId);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="page-container">
      <div className="mall-header">
        <div className="mall-header-content">
          <h1>Compare Products</h1>
          <p className="mall-location-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {selectedMall?.name}
          </p>
        </div>
        <button 
          className="btn btn-sm btn-secondary"
          onClick={() => navigate('/user/malls')}
        >
          Change Mall
        </button>
      </div>
      <p className="subtitle">Select products to compare across different shops</p>

      <div className="filters-container">
        <div className="filter-group">
          <label>Search Products</label>
          <input
            type="text"
            placeholder="Search by product or shop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-content">
            <span>{compareList.length} product{compareList.length > 1 ? 's' : ''} selected</span>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setCompareList([])}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {compareList.length >= 2 && (
        <div className="comparison-container">
          <h2>Product Comparison</h2>
          <div className="compare-grid">
            {compareList.map((product) => (
              <div key={product.id} className="compare-item">
                {product.imageURL && (
                  <img src={product.imageURL} alt={product.name} className="compare-image" />
                )}
                <h3>{product.name}</h3>
                <p className="compare-price">₹{product.price}</p>
                <div className="compare-details">
                  <p><strong>Features:</strong> {product.features || 'N/A'}</p>
                  <p><strong>Shop:</strong> {product.shopName || 'N/A'}</p>
                  <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                  <p><strong>Floor:</strong> {product.floor || 'N/A'}</p>
                  {product.offer && (
                    <p className="compare-offer">
                      🎉 {product.offer.discount}% OFF
                    </p>
                  )}
                </div>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleAddToCompare(product)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="products-selection">
        <h2>Select Products to Compare</h2>
        <p className="info-text">Choose up to 4 products from different shops to compare</p>
        
        {filteredProducts.length === 0 ? (
          <p className="empty-message">No products found</p>
        ) : (
          <div className="cards-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="card product-card">
                {product.imageURL && (
                  <img src={product.imageURL} alt={product.name} className="product-image" />
                )}
                <div className="card-header">
                  <h3>{product.name}</h3>
                  <span className="badge">{product.category}</span>
                </div>
                <div className="card-body">
                  <p className="price">₹{product.price}</p>
                  <p><strong>Shop:</strong> {product.shopName}</p>
                  <p><strong>Floor:</strong> {product.floor}</p>
                  {product.offer && (
                    <span className="offer-badge">
                      🎉 {product.offer.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="card-footer">
                  <button
                    onClick={() => handleAddToCompare(product)}
                    className={`btn btn-sm ${isInCompareList(product.id) ? 'btn-danger' : 'btn-primary'}`}
                    disabled={!isInCompareList(product.id) && compareList.length >= 4}
                  >
                    {isInCompareList(product.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCompare;

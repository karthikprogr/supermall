import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import ProductCard from '../../components/ProductCard';
import CompareModal from '../../components/CompareModal';
import Filters from '../../components/Filters';
import AsyncState from '../../components/AsyncState';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    floor: '',
    searchTerm: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance',
    hasOfferOnly: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectedMall } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [selectedMall]);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const fetchProducts = async () => {
    try {
      setError('');
      setLoading(true);
      // Get all shops (or filter by mall if selected)
      let shopsSnapshot;
      if (selectedMall) {
        const shopsQuery = query(
          collection(db, 'shops'),
          where('mallId', '==', selectedMall.id)
        );
        shopsSnapshot = await getDocs(shopsQuery);
      } else {
        // Get all shops from all malls
        shopsSnapshot = await getDocs(collection(db, 'shops'));
      }
      
      const shopIds = shopsSnapshot.docs.map(doc => doc.id);

      // Then, get all products from those shops
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs
        .filter(doc => shopIds.includes(doc.data().shopId))
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      // Fetch shop details and offers for each product
      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          // Get shop details
          if (product.shopId) {
            const shop = shopsSnapshot.docs.find(doc => doc.id === product.shopId);
            if (shop) {
              product.shopName = shop.data().shopName;
              product.category = shop.data().category;
              product.floor = shop.data().floor;
            }
          }

          // Get offer details
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
      setError('Unable to load products at the moment. Please retry.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    const minPriceValue = Number(filters.minPrice);
    const maxPriceValue = Number(filters.maxPrice);

    const toNumber = (value) => Number(value) || 0;
    const getCreatedTime = (value) => {
      if (!value) return 0;
      if (typeof value?.seconds === 'number') return value.seconds * 1000;
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.floor) {
      filtered = filtered.filter(product => product.floor === filters.floor);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (product.features && product.features.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (product.shopName && product.shopName.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    if (filters.minPrice !== '' && !Number.isNaN(minPriceValue)) {
      filtered = filtered.filter(product => toNumber(product.price) >= minPriceValue);
    }

    if (filters.maxPrice !== '' && !Number.isNaN(maxPriceValue)) {
      filtered = filtered.filter(product => toNumber(product.price) <= maxPriceValue);
    }

    if (filters.hasOfferOnly) {
      filtered = filtered.filter(product => Boolean(product.offer));
    }

    if (filters.sortBy === 'priceLowHigh') {
      filtered.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    } else if (filters.sortBy === 'priceHighLow') {
      filtered.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    } else if (filters.sortBy === 'offerHighLow') {
      filtered.sort((a, b) => toNumber(b.offer?.discount) - toNumber(a.offer?.discount));
    } else if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => getCreatedTime(b.createdAt) - getCreatedTime(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const hasActiveFilters = Boolean(
    filters.category ||
      filters.floor ||
      filters.searchTerm ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.hasOfferOnly ||
      filters.sortBy !== 'relevance'
  );

  const resetAllFilters = () => {
    setFilters({
      category: '',
      floor: '',
      searchTerm: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance',
      hasOfferOnly: false
    });
  };

  const handleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length < 4) {
        setCompareList([...compareList, product]);
      } else {
        alert('You can compare up to 4 products at a time');
      }
    }
  };

  const handleShowCompare = () => {
    if (compareList.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    setShowCompareModal(true);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="page-container user-marketplace-page">
      <div className="page-header">
        <h1>{selectedMall?.name || 'Browse Products'}</h1>
        <p className="subtitle">
          {selectedMall?.location ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedMall.location}
            </>
          ) : 'Explore and compare products'}
        </p>
      </div>
      {selectedMall && (
        <button 
          className="btn btn-sm btn-secondary marketplace-back-btn" style={{marginBottom: '1.5rem', alignSelf: 'flex-start'}}
          onClick={() => navigate('/user/malls')}
        >
          Change Mall
        </button>
      )}
      
      <Filters filters={filters} onFilterChange={setFilters} mode="products" />

      {error && (
        <AsyncState
          title="Could not fetch products"
          message={error}
          actionLabel="Retry loading products"
          onAction={fetchProducts}
        />
      )}

      <div className="filter-summary-bar">
        <span className="summary-pill">Total: {products.length}</span>
        <span className="summary-pill">Showing: {filteredProducts.length}</span>
        {filters.hasOfferOnly && <span className="summary-pill">Offer Only</span>}
        {hasActiveFilters && (
          <button onClick={resetAllFilters} className="btn btn-link summary-reset-btn">
            Reset all filters
          </button>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="compare-bar">
          <span>{compareList.length} products selected for comparison</span>
          <div className="compare-actions">
            <button onClick={handleShowCompare} className="btn btn-primary">
              Compare ({compareList.length})
            </button>
            <button onClick={() => setCompareList([])} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="results-info">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>

      <div className="cards-grid">
        {!error && filteredProducts.length === 0 ? (
          <p className="empty-message">No products found matching your filters</p>
        ) : (
          filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={`card-wrapper ${compareList.find(p => p.id === product.id) ? 'selected' : ''}`}
            >
              <ProductCard product={product} onCompare={handleCompare} />
            </div>
          ))
        )}
      </div>

      {showCompareModal && (
        <CompareModal 
          products={compareList} 
          onClose={() => setShowCompareModal(false)} 
        />
      )}
    </div>
  );
};

export default UserProducts;

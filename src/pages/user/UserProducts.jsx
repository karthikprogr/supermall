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
        <h1 className="primary-gradient-text" style={{fontSize: '3rem', marginBottom: '0.5rem'}}>Featured Collections</h1>
        <p className="subtitle" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          Explore {products.length} Items {selectedMall ? `at ${selectedMall.mallName}` : ''}
        </p>
      </div>

      <Filters filters={filters} onFilterChange={setFilters} mode="products" />

      {compareList.length > 0 && (
        <div className="glass-card" style={{position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '2rem', minWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--primary)'}}>
          <span style={{fontWeight: 700, fontSize: '0.9rem'}}>{compareList.length} Items Selected</span>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button onClick={handleShowCompare} className="btn btn-primary" style={{padding: '0.6rem 1.5rem', fontSize: '0.85rem'}}>
              Compare Now
            </button>
            <button onClick={() => setCompareList([])} className="btn-ghost" style={{color: 'var(--text-muted)', fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer'}}>
              Clear
            </button>
          </div>
        </div>
      )}


      <div className="malls-grid">

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

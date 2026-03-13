import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import AsyncState from '../../components/AsyncState';

const UserOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [offerFilters, setOfferFilters] = useState({
    searchTerm: '',
    minDiscount: '',
    sortBy: 'bestDiscount'
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
    fetchOffers();
  }, [selectedMall, navigate]);

  useEffect(() => {
    applyOfferFilters();
  }, [offers, offerFilters]);

  const fetchOffers = async () => {
    try {
      setError('');
      setLoading(true);
      // First, get all shops for the selected mall
      const shopsQuery = query(
        collection(db, 'shops'),
        where('mallId', '==', selectedMall.id)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopIds = shopsSnapshot.docs.map(doc => doc.id);

      // Get all offers and filter by shops in selected mall
      const offersSnapshot = await getDocs(collection(db, 'offers'));
      const offersData = await Promise.all(
        offersSnapshot.docs
          .map(offerDoc => ({ id: offerDoc.id, ...offerDoc.data() }))
          .map(async (offerData) => {
            // Fetch product details
            if (offerData.productId) {
              const productDoc = await getDoc(doc(db, 'products', offerData.productId));
              if (productDoc.exists()) {
                offerData.product = productDoc.data();
                
                // Fetch shop details and check if it belongs to selected mall
                if (offerData.product.shopId && shopIds.includes(offerData.product.shopId)) {
                  const shopDoc = await getDoc(doc(db, 'shops', offerData.product.shopId));
                  if (shopDoc.exists()) {
                    offerData.shop = shopDoc.data();
                    return offerData;
                  }
                }
              }
            }
            return null;
          })
      );
      
      // Filter out expired offers and null entries
      const activeOffers = offersData
        .filter(offer => offer !== null)
        .filter(offer => {
          const validTill = new Date(offer.validTill);
          return validTill >= new Date();
        });
      
      setOffers(activeOffers);
      setFilteredOffers(activeOffers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Unable to load offers right now. Please retry.');
      setLoading(false);
    }
  };

  const applyOfferFilters = () => {
    let filtered = [...offers];
    const minDiscountValue = Number(offerFilters.minDiscount);

    if (offerFilters.searchTerm) {
      const searchText = offerFilters.searchTerm.toLowerCase();
      filtered = filtered.filter((offer) =>
        (offer.product?.name || '').toLowerCase().includes(searchText) ||
        (offer.shop?.shopName || '').toLowerCase().includes(searchText) ||
        (offer.description || '').toLowerCase().includes(searchText)
      );
    }

    if (offerFilters.minDiscount !== '' && !Number.isNaN(minDiscountValue)) {
      filtered = filtered.filter((offer) => Number(offer.discount) >= minDiscountValue);
    }

    if (offerFilters.sortBy === 'bestDiscount') {
      filtered.sort((a, b) => Number(b.discount) - Number(a.discount));
    } else if (offerFilters.sortBy === 'expiringSoon') {
      filtered.sort((a, b) => new Date(a.validTill) - new Date(b.validTill));
    } else if (offerFilters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.validTill) - new Date(a.validTill));
    }

    setFilteredOffers(filtered);
  };

  if (loading) {
    return <div className="loading">Loading offers...</div>;
  }

  return (
    <div className="page-container user-marketplace-page">
      <div className="page-header">
        <h1>{selectedMall?.name || 'Active Offers'}</h1>
        <p className="subtitle">
          {selectedMall?.location ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.25rem'}}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedMall.location}
            </>
          ) : 'Discover the best deals and discounts'}
        </p>
      </div>
      <button 
        className="btn btn-sm btn-secondary marketplace-back-btn" style={{marginBottom: '1.5rem', alignSelf: 'flex-start'}}
        onClick={() => navigate('/user/malls')}
      >
        Change Mall
      </button>

      <div className="filters-container">
        <div className="filter-group">
          <label>Search Offers</label>
          <input
            type="text"
            placeholder="Search by product, shop, or description"
            value={offerFilters.searchTerm}
            onChange={(e) => setOfferFilters({ ...offerFilters, searchTerm: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Minimum Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 20"
            value={offerFilters.minDiscount}
            onChange={(e) => setOfferFilters({ ...offerFilters, minDiscount: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="filter-group">
          <label>Sort Offers</label>
          <select
            value={offerFilters.sortBy}
            onChange={(e) => setOfferFilters({ ...offerFilters, sortBy: e.target.value })}
            className="select-field"
          >
            <option value="bestDiscount">Best Discount</option>
            <option value="expiringSoon">Expiring Soon</option>
            <option value="latest">Latest Validity</option>
          </select>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() =>
            setOfferFilters({
              searchTerm: '',
              minDiscount: '',
              sortBy: 'bestDiscount'
            })
          }
        >
          Clear Filters
        </button>
      </div>

      <div className="results-info">
        <p>Showing {filteredOffers.length} of {offers.length} active offers</p>
      </div>

      {error && (
        <AsyncState
          title="Could not fetch offers"
          message={error}
          actionLabel="Retry loading offers"
          onAction={fetchOffers}
        />
      )}

      {!error && filteredOffers.length === 0 ? (
        <div className="empty-state">
          <p>No offers match your filters right now.</p>
        </div>
      ) : (
        <div className="offers-grid">
          {filteredOffers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="offer-badge-large">{offer.discount}% OFF</div>
              
              {offer.product?.imageURL && (
                <div className="offer-image">
                  <img src={offer.product.imageURL} alt={offer.product.name} />
                </div>
              )}
              
              <div className="offer-details">
                <h3>{offer.product?.name || 'Product'}</h3>
                <p className="offer-price">
                  <span className="original-price">₹{offer.product?.price}</span>
                  <span className="discounted-price">
                    ₹{(offer.product?.price * (1 - offer.discount / 100)).toFixed(2)}
                  </span>
                </p>
                
                {offer.shop && (
                  <p className="offer-shop">
                    <strong>Shop:</strong> {offer.shop.shopName}
                  </p>
                )}
                
                {offer.description && (
                  <p className="offer-description">{offer.description}</p>
                )}
                
                <p className="offer-validity">
                  <strong>Valid till:</strong> {new Date(offer.validTill).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOffers;

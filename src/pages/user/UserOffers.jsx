import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';

const UserOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedMall } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMall) {
      navigate('/user/malls');
      return;
    }
    fetchOffers();
  }, [selectedMall, navigate]);

  const fetchOffers = async () => {
    try {
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading offers...</div>;
  }

  return (
    <div className="page-container">
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
        className="btn btn-sm btn-secondary" style={{marginBottom: '1.5rem', alignSelf: 'flex-start'}}
        onClick={() => navigate('/user/malls')}
      >
        Change Mall
      </button>

      {offers.length === 0 ? (
        <div className="empty-state">
          <p>No active offers at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="offers-grid">
          {offers.map(offer => (
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

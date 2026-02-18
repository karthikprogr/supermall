import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onCompare, showCompare = true, showSaveButton = true, onOfferDeleted }) => {
  const [offer, setOffer] = useState(null);
  const [showOfferActions, setShowOfferActions] = useState(false);
  const { toggleSavedItem, isSaved } = useUserContext();
  const { userRole } = useAuth();
  const isUserRole = userRole === 'user';
  const isMerchantRole = userRole === 'merchant';

  useEffect(() => {
    fetchOffer();
  }, [product.id]);

  const fetchOffer = async () => {
    try {
      const offersQuery = query(
        collection(db, 'offers'),
        where('productId', '==', product.id)
      );
      const offersSnapshot = await getDocs(offersQuery);
      if (!offersSnapshot.empty) {
        const offerData = offersSnapshot.docs[0].data();
        setOffer({
          id: offersSnapshot.docs[0].id,
          ...offerData
        });
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
    }
  };

  const handleDeleteOffer = async () => {
    if (!window.confirm('Delete this offer?')) return;

    try {
      await deleteDoc(doc(db, 'offers', offer.id));
      setOffer(null);
      setShowOfferActions(false);
      if (onOfferDeleted) onOfferDeleted();
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  return (
    <div className="card product-card">
      {product.imageURL && (
        <div className="product-image">
          <img src={product.imageURL} alt={product.name} />
          {offer && (
            <div className="offer-badge-display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9h12M9 13h6M9 17h6"/>
                <path d="M4 19h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
              </svg>
              <span>{offer.discount}% OFF</span>
            </div>
          )}
          {isUserRole && showSaveButton && (
            <button
              className={`btn-save-product ${isSaved(product.id) ? 'saved' : ''}`}
              onClick={() => toggleSavedItem(product.id)}
              title={isSaved(product.id) ? 'Remove from saved' : 'Save product'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        {product.features && (
          <p className="product-features">{product.features}</p>
        )}
        {offer && (
          <div className="offer-section">
            <div className="offer-details">
              <p className="offer-discount">{offer.discount}% Discount</p>
              {offer.description && <p className="offer-description">{offer.description}</p>}
              <p className="offer-validity">Valid till: {new Date(offer.validTill).toLocaleDateString()}</p>
            </div>
            {isMerchantRole && (
              <div className="offer-actions-mini">
                <button 
                  className="btn-offers-action"
                  onClick={() => setShowOfferActions(!showOfferActions)}
                  title="Manage offer"
                >
                  ⋯
                </button>
                {showOfferActions && (
                  <div className="offer-actions-menu">
                    <button 
                      className="btn btn-link"
                      onClick={handleDeleteOffer}
                    >
                      Delete Offer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showCompare && (
        <div className="card-footer">
          {isUserRole && (
            <button 
              onClick={() => toggleSavedItem(product.id)}
              className={`btn ${isSaved(product.id) ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {isSaved(product.id) ? 'Saved' : 'Save'}
            </button>
          )}
          <button 
            onClick={() => onCompare(product)} 
            className="btn btn-secondary"
          >
            Compare
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

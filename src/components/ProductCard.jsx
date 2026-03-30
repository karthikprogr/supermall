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
    <div className={`glass-card product-card ${isSaved(product.id) ? 'saved' : ''}`} style={{display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%'}}>
      <div className="mall-image" style={{height: '280px', position: 'relative', overflow: 'hidden', background: '#1e293b'}}>
        <img 
          src={product.imageURL || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80`} 
          alt={product.name} 
          style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}}
          className="hover-zoom-img"
        />
        {offer && (
          <div className="mall-badge" style={{position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent)', color: '#fff', border: 'none'}}>
            {offer.discount}% OFF
          </div>
        )}
        {isUserRole && showSaveButton && (
          <button
            className="btn-save"
            onClick={(e) => { e.stopPropagation(); toggleSavedItem(product.id); }}
            style={{
              position: 'absolute', top: '1rem', right: '1rem', 
              width: '40px', height: '40px', borderRadius: '50%',
              background: isSaved(product.id) ? 'var(--primary)' : 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyCenter: 'center', cursor: 'pointer', transition: '0.3s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(product.id) ? 'white' : 'none'} stroke={isSaved(product.id) ? 'white' : 'white'} strokeWidth="2" style={{margin: 'auto'}}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="mall-info" style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
        <span className="mall-selection-pill" style={{fontSize: '0.65rem', padding: '0.3rem 0.8rem', marginBottom: '0.75rem'}}>
          {product.category || 'Premium'}
        </span>
        <h3 style={{fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff'}}>{product.name}</h3>
        
        <div style={{display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem'}}>
          <span style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)'}}>₹{product.price}</span>
          {offer && product.price && (
            <span style={{fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'line-through'}}>
              ₹{Math.round(product.price * (1 + offer.discount/100))}
            </span>
          )}
        </div>

        {product.features && (
          <p className="mall-description" style={{fontSize: '0.85rem', marginBottom: '1.5rem', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {product.features}
          </p>
        )}

        <div className="mall-card-cta" style={{marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)'}}>
          <button 
            onClick={() => onCompare(product)}
            className="btn btn-outline" 
            style={{flex: 1, padding: '0.75rem', fontSize: '0.85rem'}}
          >
            Compare
          </button>
          <button className="btn btn-primary" style={{flex: 1.5, padding: '0.75rem', fontSize: '0.85rem'}}>
            View Offer
          </button>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;

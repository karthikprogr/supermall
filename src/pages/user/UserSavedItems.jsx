import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import ProductCard from "../../components/ProductCard";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserSavedItems = () => {
  const { currentUser } = useAuth();
  const { savedItems, toggleSavedItem } = useUserContext();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSavedItems = async () => {
    if (!currentUser?.uid || savedItems.length === 0) {
      setSavedProducts([]); setLoading(false); return;
    }
    try {
      setError(null); setLoading(true);
      const products = [];
      for (const id of savedItems) {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) products.push({ id: snap.id, ...snap.data() });
      }
      setSavedProducts(products);
    } catch (err) { setError("Failed to synchronize saved assets."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSavedItems(); }, [currentUser?.uid, savedItems]);

  if (loading) return <div className="loading">Syncing Saved Assets...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Curated Inventory</h1>
        <p className="subtitle">High-performance tracking of your bookmarked retail products</p>
      </div>

      {!error && savedProducts.length === 0 ? (
        <div className="text-center" style={{padding: '5rem 0'}}>
          <div className="auth-icon" style={{margin: '0 auto 2rem'}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#fff">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>Archive Empty</h2>
          <p className="subtitle" style={{marginBottom: '2rem'}}>You have not registered any visual assets to your collection yet.</p>
          <button onClick={() => navigate('/user/products')} className="btn btn-primary btn-large">Explore Market</button>
        </div>
      ) : (
        <div className="admin-data-grid">
          {savedProducts.map((product) => (
            <div key={product.id} className="data-card glass-card" style={{padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
              <div style={{height: '240px', position: 'relative', overflow: 'hidden'}}>
                <img 
                  src={product.imageURL || 'https://via.placeholder.com/400x300'} 
                  alt={product.name} 
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  className="hover-zoom-img"
                />
                <button 
                  onClick={() => toggleSavedItem(product.id)}
                  style={{position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239, 68, 68, 0.9)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center', backdropFilter: 'blur(10px)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)'}}
                  title="Remove Asset"
                >
                  <svg width="18" height="18" style={{margin: '0 auto'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div style={{padding: '2rem', flexGrow: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div>
                    <span style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Asset Saved</span>
                    <h3 style={{fontSize: '1.5rem', marginTop: '0.75rem', fontWeight: 700}}>{product.name}</h3>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)'}}>₹{product.price}</p>
                    {product.oldPrice && <p style={{fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'line-through'}}>₹{product.oldPrice}</p>}
                  </div>
                </div>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6'}}>{product.features || 'No additional technical metadata provided for this asset.'}</p>
              </div>

              <div style={{padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '1rem'}}>
                <button className="btn btn-primary btn-sm" style={{flex: 1, justifyContent: 'center'}}>View Offer</button>
                <button className="btn btn-secondary btn-sm" style={{flex: 1, justifyContent: 'center', opacity: 0.6}}>Compare</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSavedItems;

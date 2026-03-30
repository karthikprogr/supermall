import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logShop } from '../../utils/logger';

const MerchantShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) fetchShops(); }, [currentUser]);

  const fetchShops = async () => {
    try {
      const q = query(collection(db, 'shops'), where('ownerId', '==', currentUser.uid));
      const snap = await getDocs(q);
      setShops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleDelete = async (shopId, shopName) => {
    if (!window.confirm(`Suspend store "${shopName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'shops', shopId));
      await logShop.delete(currentUser.uid, shopName, shopId);
      fetchShops();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Retrieving Storefront Data...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text" style={{fontSize: '3rem'}}>Storefront Directory</h1>
          <p className="subtitle">Manage and optimize your operational retail assets</p>
        </div>
        <button onClick={() => navigate('/merchant/shops/create')} className="btn btn-primary">+ Deploy New Store</button>
      </div>

      {shops.length === 0 ? (
        <div className="glass-card section-padding text-center">
          <p style={{color: 'var(--text-muted)'}}>No retail infrastructure initialized yet.</p>
          <button onClick={() => navigate('/merchant/shops/create')} className="btn btn-primary" style={{marginTop: '2rem'}}>Initialize First Shop</button>
        </div>
      ) : (
        <div className="admin-data-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 450px))', gap: '2rem'}}>
          {shops.map(shop => (
            <div key={shop.id} className="glass-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {shop.imageURL && (
                <div style={{width: 'calc(100% + 4rem)', margin: '-2rem -2rem 1.5rem -2rem', height: '180px', overflow: 'hidden'}}>
                  <img src={shop.imageURL} alt={shop.shopName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                 <div>
                   <h4 style={{fontSize: '1.4rem', fontWeight: 800, color: '#fff'}}>{shop.shopName}</h4>
                   <p style={{color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginTop: '0.2rem'}}>{shop.category.toUpperCase()}</p>
                 </div>
                 <div style={{background: 'rgba(52, 211, 153, 0.1)', color: 'var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em'}}>ACTIVE</div>
              </div>
              
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', color: 'var(--text-dim)', fontSize: '0.9rem'}}>
                 <div><strong>Level:</strong> {shop.floor}</div>
                 <div><strong>Mall:</strong> {shop.mallName}</div>
              </div>

              <div style={{marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', justifyContent: 'flex-start'}}>
                <button onClick={() => navigate(`/merchant/products?shopId=${shop.id}`)} className="btn btn-sm btn-primary">Add</button>
                <button onClick={() => navigate(`/merchant/shops/edit/${shop.id}`)} className="btn btn-sm btn-secondary">Modify</button>
                <button onClick={() => handleDelete(shop.id, shop.shopName)} className="btn btn-sm btn-danger">X</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantShops;

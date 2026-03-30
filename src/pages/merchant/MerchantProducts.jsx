import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';

const MerchantProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) fetchProducts(); }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), where('ownerId', '==', currentUser.uid));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Suspend product catalog for "${productName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      await logProduct.delete(currentUser.uid, productName, productId);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Syncing Inventory Catalog...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text" style={{fontSize: '3rem'}}>Inventory Catalog</h1>
          <p className="subtitle">High-performance management of your verified product assets</p>
        </div>
        <button onClick={() => navigate('/merchant/products/add')} className="btn btn-primary">+ Catalog New product</button>
      </div>

      {products.length === 0 ? (
        <div className="glass-card section-padding text-center">
          <p style={{color: 'var(--text-muted)'}}>No retail assets found in the digital ledger.</p>
          <button onClick={() => navigate('/merchant/products/add')} className="btn btn-primary" style={{marginTop: '2rem'}}>Provision First Product</button>
        </div>
      ) : (
        <div className="admin-data-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 450px))', gap: '2rem'}}>
          {products.map(product => (
            <div key={product.id} className="glass-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden'}}>
              {product.imageURL && (
                <div style={{width: 'calc(100% + 4rem)', margin: '-2rem -2rem 1.5rem -2rem', height: '180px', overflow: 'hidden'}}>
                  <img src={product.imageURL} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s ease'}} className="hover-zoom-img" />
                </div>
              )}
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                 <div>
                   <h4 style={{fontSize: '1.4rem', fontWeight: 800, color: '#fff'}}>{product.name}</h4>
                   <p style={{color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem'}}>₹{product.price}</p>
                 </div>
                 <div style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em'}}>IN_STOCK</div>
              </div>
              
              <div style={{color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.6', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                 {product.features || 'No technical specifications provided for this asset.'}
              </div>

              <div style={{marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', justifyContent: 'flex-start'}}>
                <button onClick={() => navigate(`/merchant/products/edit/${product.id}`)} className="btn btn-sm btn-primary">Edit</button>
                <button onClick={() => navigate(`/merchant/offers/create?productId=${product.id}`)} className="btn btn-sm btn-secondary">Offer</button>
                <button onClick={() => handleDelete(product.id, product.name)} className="btn btn-sm btn-danger">X</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantProducts;

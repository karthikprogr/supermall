import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminViewShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchShopDetails(); }, [id]);

  const fetchShopDetails = async () => {
    try {
      const shopDoc = await getDoc(doc(db, 'shops', id));
      if (!shopDoc.exists()) throw new Error('Shop not found');
      
      const shopData = { id: shopDoc.id, ...shopDoc.data() };
      setShop(shopData);

      if (shopData.ownerId) {
        const ownerDoc = await getDoc(doc(db, 'users', shopData.ownerId));
        if (ownerDoc.exists()) setOwner(ownerDoc.data());
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${shop.shopName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'shops', id));
      navigate('/admin/shops');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Retaining shop telemetry...</div>;
  if (error) return <div className="admin-page container section-padding text-center"><h2>{error}</h2><button onClick={() => navigate('/admin/shops')} className="btn btn-secondary">Return to List</button></div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text" style={{fontSize: '3rem'}}>{shop.shopName}</h1>
          <p className="subtitle">Operational metrics and storefront metadata</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '0.5rem'}}>
          <button onClick={() => navigate(`/admin/edit-shop/${id}`)} className="btn btn-primary">Edit Logic</button>
          <button onClick={handleDelete} className="btn btn-danger">Suspend Store</button>
        </div>
      </div>

      <div className="admin-grid-layout" style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginBottom: '4rem'}}>
        <div className="glass-card section-padding">
          <h3 className="stat-label" style={{marginBottom: '2rem'}}>Shop Information</h3>
          <div className="info-display-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem'}}>
            <div className="info-item">
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Category</label>
              <span style={{fontSize: '1.25rem', fontWeight: 700}}>{shop.category}</span>
            </div>
            <div className="info-item">
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Floor Level</label>
              <span style={{fontSize: '1.25rem', fontWeight: 700}}>{shop.floor}</span>
            </div>
            <div className="info-item">
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Contact Protocol</label>
              <span style={{fontSize: '1.1rem'}}>{shop.contactNumber || 'NO_SIGNAL'}</span>
            </div>
            <div className="info-item">
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Initialization</label>
              <span style={{fontSize: '1.1rem'}}>{new Date(shop.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item" style={{gridColumn: 'span 2'}}>
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Operational Context</label>
              <p style={{color: 'var(--text-dim)', lineHeight: 1.6}}>{shop.description || 'No contextual profile provided for this retailer.'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card section-padding">
          <h3 className="stat-label" style={{marginBottom: '2rem'}}>Retailer Credentials</h3>
          {owner ? (
            <div className="owner-profile-card">
              <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem'}}>
                <div style={{width: '64px', height: '64px', background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', border: '1px solid var(--primary)'}}>
                  {owner.name[0]}
                </div>
                <div>
                  <h4 style={{fontSize: '1.25rem', fontWeight: 800}}>{owner.name}</h4>
                  <p style={{color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700}}>VERIFIED MERCHANT</p>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                <div style={{fontSize: '0.95rem'}}><strong style={{color: 'var(--text-muted)'}}>Email:</strong> <span style={{fontFamily: 'monospace'}}>{owner.email}</span></div>
                <div style={{fontSize: '0.95rem'}}><strong style={{color: 'var(--text-muted)'}}>Phone:</strong> {owner.contactNumber || 'N/A'}</div>
                <button onClick={() => navigate(`/admin/edit-merchant/${shop.ownerId}`)} className="btn btn-sm" style={{marginTop: '1rem', width: '100%'}}>Manage Credentials</button>
              </div>
            </div>
          ) : (
             <div className="text-center" style={{padding: '2rem 0'}}>
                <p style={{color: 'var(--text-muted)'}}>Merchant link severed or unknown.</p>
             </div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h3 className="section-title text-left" style={{fontSize: '1.5rem', marginBottom: '2.5rem'}}>Storefront Performance</h3>
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">Inventory Items</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">Active Gampaigns</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">System Revenue</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">User Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewShop;

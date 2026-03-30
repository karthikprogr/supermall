import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const MerchantDashboard = () => {
  const [stats, setStats] = useState({ myShops: 0, myProducts: 0, myOffers: 0 });
  const [recentShops, setRecentShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) fetchData(); }, [currentUser]);

  const fetchData = async () => {
    try {
      const shopsQ = query(collection(db, 'shops'), where('ownerId', '==', currentUser.uid));
      const shopsSnap = await getDocs(shopsQ);
      const shopsData = shopsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentShops(shopsData.slice(0, 4));

      const productsQ = query(collection(db, 'products'), where('ownerId', '==', currentUser.uid));
      const productsSnap = await getDocs(productsQ);

      const offersQ = query(collection(db, 'offers'), where('ownerId', '==', currentUser.uid));
      const offersSnap = await getDocs(offersQ);

      setStats({ myShops: shopsData.length, myProducts: productsSnap.size, myOffers: offersSnap.size });
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  if (loading) return <div className="loading">Syncing Retail Environment...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text" style={{fontSize: '3.5rem'}}>Retail Command Center</h1>
        <p className="subtitle">Real-time management for your shop ecosystem</p>
      </div>

      <div className="admin-action-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '5rem'}}>
        <div className="action-row glass-card" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem'}}>
          <div className="action-info" style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Quick Expansion</h3>
            <p style={{marginTop: '0.5rem'}}>Add new storefronts or provision inventory items to your existing shops.</p>
          </div>
          <div className="action-buttons" style={{width: '100%', gap: '1rem', display: 'flex'}}>
            <button onClick={() => navigate('/merchant/shops/create')} className="btn btn-primary" style={{flex: 1}}>+ New Store</button>
            <button onClick={() => navigate('/merchant/products/add')} className="btn btn-secondary" style={{flex: 1}}>+ Add Product</button>
          </div>
        </div>

        <div className="action-row glass-card" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem'}}>
          <div className="action-info" style={{marginBottom: '1.5rem'}}>
            <h3 style={{fontSize: '1.25rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Merchant Protocol</h3>
            <p style={{marginTop: '0.5rem'}}>Maximize retail performance with these synchronized steps:</p>
          </div>
          <div className="workflow-steps-vertical" style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%'}}>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>1</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Finalize Storefront layout and floor assignment</span>
            </div>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>2</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Synchronize digital inventory with physical stock</span>
            </div>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>3</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Launch promotional campaigns and flash offers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section" style={{marginBottom: '6rem'}}>
        <h3 className="section-title text-left" style={{fontSize: '1.5rem', marginBottom: '3rem'}}>Retail Analytics</h3>
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.myShops}</div>
            <p className="stat-label">Provisioned Shops</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.myProducts}</div>
            <p className="stat-label">Cataloged Products</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">{stats.myOffers}</div>
            <p className="stat-label">Active Campaigns</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">System Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity-section">
        <h3 className="section-title text-left" style={{fontSize: '1.5rem', marginBottom: '2.5rem'}}>Operational Stores</h3>
        {recentShops.length === 0 ? (
          <div className="glass-card section-padding text-center">
            <p style={{color: 'var(--text-muted)'}}>No retail infrastructure initialized yet.</p>
          </div>
        ) : (
          <div className="admin-data-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 450px))', gap: '2rem'}}>
            {recentShops.map(shop => (
              <div key={shop.id} className="glass-card" style={{padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                {shop.imageURL && (
                  <div style={{width: 'calc(100% + 4rem)', margin: '-2rem -2rem 2rem -2rem', height: '180px', overflow: 'hidden'}}>
                    <img src={shop.imageURL} alt={shop.shopName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                )}
                <div style={{marginBottom: '1.5rem'}}>
                  <h4 style={{fontSize: '1.5rem', fontWeight: 800, color: '#fff'}}>{shop.shopName}</h4>
                  <p style={{color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginTop: '0.25rem'}}>{shop.category.toUpperCase()}</p>
                </div>
                <div style={{color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                   <div><strong>Level:</strong> {shop.floor}</div>
                   <div><strong>Status:</strong> <span style={{color: 'var(--accent)'}}>OPERATIONAL</span></div>
                </div>
                <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', justifyContent: 'flex-start'}}>
                   <button onClick={() => navigate('/merchant/products')} className="btn btn-sm btn-primary">Manage Inventory</button>
                   <button onClick={() => navigate('/merchant/shops')} className="btn btn-sm btn-secondary">Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;

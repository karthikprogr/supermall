import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMalls: 0,
    totalShops: 0,
    totalProducts: 0,
    totalMerchants: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      const shopsSnapshot = await getDocs(collection(db, 'shops'));
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      const merchantsCount = usersSnapshot.docs.filter(doc => doc.data().role === 'merchant').length;

      setStats({
        totalMalls: mallsSnapshot.size,
        totalShops: shopsSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalMerchants: merchantsCount
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Admin Command Center</h1>
        <p className="subtitle">Real-time overview of the Super Mall ecosystem</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-number">{stats.totalMalls}</div>
          <p className="stat-label">Super Malls</p>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number">{stats.totalShops}</div>
          <p className="stat-label">Total Shops</p>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number">{stats.totalProducts}</div>
          <p className="stat-label">Total Products</p>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number">{stats.totalMerchants}</div>
          <p className="stat-label">Merchants</p>
        </div>
      </div>

      <div className="admin-action-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '5rem'}}>
        <div className="action-row glass-card" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem'}}>
          <div className="action-info" style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Quick Launch</h3>
            <p style={{marginTop: '0.5rem'}}>Expand the system by adding new infrastructure or retail personnel.</p>
          </div>
          <div className="action-buttons" style={{width: '100%', gap: '1rem'}}>
            <button onClick={() => navigate('/admin/create-mall')} className="btn btn-primary" style={{flex: 1}}>
              + New Mall
            </button>
            <button onClick={() => navigate('/admin/create-merchant')} className="btn btn-primary" style={{flex: 1}}>
              + New Merchant
            </button>
          </div>
        </div>

        <div className="action-row glass-card" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem'}}>
          <div className="action-info" style={{marginBottom: '1.5rem'}}>
            <h3 style={{fontSize: '1.25rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Operational Protocol</h3>
            <p style={{marginTop: '0.5rem'}}>Follow this sequence for optimal ecosystem synchronization:</p>
          </div>
          <div className="workflow-steps-vertical" style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%'}}>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>1</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Initialize Super Mall infrastructure</span>
            </div>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>2</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Provision Merchant Partner credentials</span>
            </div>
            <div className="step-item" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div style={{width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900}}>3</div>
               <span style={{fontSize: '0.9rem', color: 'var(--text-dim)'}}>Coordinate asset assignments (Stores/Malls)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="management-links-section">
        <h2 className="section-title text-left" style={{fontSize: '2rem', marginBottom: '2.5rem'}}>Management Modules</h2>
        <div className="management-grid">
          <div onClick={() => navigate('/admin/malls')} className="module-card glass-card clickable">
            <div className="module-icon" style={{background: 'linear-gradient(135deg, var(--primary), var(--secondary))'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="module-info">
              <h4>Malls</h4>
              <p>Configure architectural layout and metadata for all mega-malls.</p>
            </div>
          </div>

          <div onClick={() => navigate('/admin/merchants')} className="module-card glass-card clickable">
            <div className="module-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="module-info">
              <h4>Merchants</h4>
              <p>Verify credentials and oversee the full merchant directory.</p>
            </div>
          </div>

          <div onClick={() => navigate('/admin/shops')} className="module-card glass-card clickable">
            <div className="module-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="module-info">
              <h4>Digital Shops</h4>
              <p>Inventory health and store-front performance monitoring.</p>
            </div>
          </div>

          <div onClick={() => navigate('/admin/categories')} className="module-card glass-card clickable">
            <div className="module-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="module-info">
              <h4>Taxonomy</h4>
              <p>Define logic for product categories and floor architectures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMalls: 0,
    totalShops: 0,
    totalProducts: 0,
    totalMerchants: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch malls
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      const mallsCount = mallsSnapshot.size;

      // Fetch shops
      const shopsSnapshot = await getDocs(collection(db, 'shops'));
      const shopsCount = shopsSnapshot.size;

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsCount = productsSnapshot.size;

      // Fetch merchants
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const merchantsCount = usersSnapshot.docs.filter(doc => doc.data().role === 'merchant').length;

      setStats({
        totalMalls: mallsCount,
        totalShops: shopsCount,
        totalProducts: productsCount,
        totalMerchants: merchantsCount
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalMalls}</h3>
          <p>Super Malls</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalShops}</h3>
          <p>Total Shops</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalProducts}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalMerchants}</h3>
          <p>Total Merchants</p>
        </div>
      </div>

      <div className="admin-actions">
        <button 
          onClick={() => navigate('/admin/create-mall')} 
          className="btn btn-success"
        >
          + Create Super Mall
        </button>
        <button 
          onClick={() => navigate('/admin/create-merchant')} 
          className="btn btn-primary"
        >
          + Create Merchant
        </button>
        <button 
          onClick={() => navigate('/admin/merchants')} 
          className="btn btn-secondary"
        >
          View All Merchants
        </button>
      </div>

      <div className="workflow-note">
        <h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Categories and floors are managed by merchants, not admin.
        
          Setup Workflow
        </h3>
        <div className="workflow-steps">
          <p><strong>Step 1:</strong> Create Super Mall structure</p>
          <p><strong>Step 2:</strong> Create Merchant accounts and assign to malls</p>
          <p><strong>Step 3:</strong> Merchants create shops, products, offers, categories & floors in their assigned malls</p>
          <p><strong>Step 4:</strong> Users browse and compare products across shops</p>
        </div>
        <p className="note-text">ℹ️ Categories and floors are managed by merchants, not admin.</p>
      </div>

      <div className="quick-links">
        <h3>Quick Links</h3>
        <div className="links-grid">
          <button onClick={() => navigate('/admin/malls')} className="link-card">
            <span className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </span>
            <span className="link-title">View All Malls</span>
          </button>
          <button onClick={() => navigate('/admin/merchants')} className="link-card">
            <span className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span className="link-title">View All Merchants</span>
          </button>
          <button onClick={() => navigate('/admin/shops')} className="link-card">
            <span className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            <span className="link-title">View All Shops</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

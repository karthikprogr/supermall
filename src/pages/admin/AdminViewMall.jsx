import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminViewMall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mall, setMall] = useState(null);
  const [merchantsCount, setMerchantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchMallDetails(); }, [id]);

  const fetchMallDetails = async () => {
    try {
      const mallDoc = await getDoc(doc(db, 'malls', id));
      if (!mallDoc.exists()) throw new Error('Mall not found');
      
      const mallData = { id: mallDoc.id, ...mallDoc.data() };
      setMall(mallData);

      const merchantsQuery = query(collection(db, 'users'), where('role', '==', 'merchant'), where('mallId', '==', id));
      const merchantsSnapshot = await getDocs(merchantsQuery);
      setMerchantsCount(merchantsSnapshot.size);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to load infrastructure telemetry.');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Initializing Mall Interface...</div>;
  if (error) return <div className="admin-page container section-padding text-center"><h2>{error}</h2><button onClick={() => navigate('/admin/malls')} className="btn btn-secondary">Return to List</button></div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text" style={{fontSize: '3rem'}}>{mall.mallName}</h1>
          <p className="subtitle">High-fidelity infrastructure architectural view</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '0.5rem'}}>
          <button onClick={() => navigate(`/admin/edit-mall/${id}`)} className="btn btn-primary">Edit Shell</button>
          <button onClick={() => navigate('/admin/malls')} className="btn btn-secondary">List Architecture</button>
        </div>
      </div>

      <div className="admin-grid-layout" style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginBottom: '5rem'}}>
        <div className="glass-card section-padding">
          <h3 className="stat-label" style={{marginBottom: '2rem'}}>Mall Specification</h3>
          <div className="info-display-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem'}}>
            <div className="info-item">
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Precinct / Location</label>
              <span style={{fontSize: '1.25rem', fontWeight: 700}}>{mall.location}</span>
            </div>
            <div className="info-item">
               <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Initialization Date</label>
               <span style={{fontSize: '1.25rem', fontWeight: 700}}>{new Date(mall.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
               <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Created By</label>
               <span style={{fontSize: '1.1rem'}}>{mall.createdBy || 'SYSTEM_CORE'}</span>
            </div>
            <div className="info-item">
               <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Mall ID</label>
               <span style={{fontFamily: 'monospace', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '4px'}}>{mall.id.slice(0, 16)}...</span>
            </div>
            <div className="info-item" style={{gridColumn: 'span 2'}}>
              <label style={{display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem'}}>Architectural Synopsis</label>
              <p style={{color: 'var(--text-dim)', lineHeight: 1.6}}>{mall.description || 'No descriptive blueprint provided for this environment.'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card section-padding">
           <h3 className="stat-label" style={{marginBottom: '2.5rem'}}>Capacity Status</h3>
           <div className="capacity-view" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
             <div className="capacity-stat">
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 800, fontSize: '1.25rem'}}>
                   <span>Merchant Slots</span>
                   <span style={{color: 'var(--primary)'}}>{merchantsCount} / {mall.maxMerchants || 10}</span>
                </div>
                <div style={{width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'}}>
                   <div style={{width: `${(merchantsCount / (mall.maxMerchants || 10)) * 100}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))'}}></div>
                </div>
                <p style={{marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem'}}>Currently managing {merchantsCount} retail partners across the ecosystem.</p>
             </div>
             <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem'}}>
                <button onClick={() => navigate('/admin/create-merchant')} className="btn btn-primary" style={{flex: 1}}>Provision Merchant</button>
             </div>
           </div>
        </div>
      </div>

       <div className="stats-section">
        <h3 className="section-title text-left" style={{fontSize: '1.5rem', marginBottom: '2.5rem'}}>High-Level Metrics</h3>
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-number">{merchantsCount}</div>
            <p className="stat-label">Provisioned Merchants</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">Active Storefronts</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">Category Segments</p>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-number">0</div>
            <p className="stat-label">Vertical Floors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewMall;

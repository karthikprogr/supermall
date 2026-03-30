import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminMalls = () => {
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);

  const fetchMalls = async () => {
    try {
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      const mallsData = mallsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMalls(mallsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching malls:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (mallId, mallName) => {
    if (!window.confirm(`Are you sure you want to delete "${mallName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'malls', mallId));
      setMalls(malls.filter(mall => mall.id !== mallId));
    } catch (error) {
      console.error('Error deleting mall:', error);
    }
  };

  if (loading) return <div className="loading">Loading infrastructure...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text">Super Mall Infrastructure</h1>
          <p className="subtitle" style={{marginTop: '0.5rem'}}>Oversee and configure multi-floor shopping environments</p>
        </div>
        <button onClick={() => navigate('/admin/create-mall')} className="btn btn-primary btn-large">
          + Initialize New Mall
        </button>
      </div>

      {malls.length === 0 ? (
        <div className="empty-state glass-card section-padding text-center">
          <h2>No Mall Infrastructure Configured</h2>
          <p style={{margin: '1.5rem 0 2rem', color: 'var(--text-dim)'}}>Begin by defining your first high-performance shopping destination.</p>
          <button onClick={() => navigate('/admin/create-mall')} className="btn btn-primary">
            Initialize First Mall
          </button>
        </div>
      ) : (
        <div className="admin-data-grid">
          {malls.map(mall => (
            <div key={mall.id} className="admin-data-card glass-card">
              <div className="data-header">
                <div>
                  <h3 style={{fontSize: '1.75rem', marginBottom: '0.25rem'}}>{mall.mallName}</h3>
                  <div className="data-badge">ID: {mall.id.slice(0,8)}...</div>
                </div>
                <div style={{color: 'var(--primary)', fontWeight: 800}}>ACTIVE</div>
              </div>
              
              <div className="data-content">
                <p><strong>📍 Location:</strong> {mall.location}</p>
                <p><strong>👤 Supervisor:</strong> {mall.merchantEmail}</p>
                <p><strong>🏢 Structure:</strong> {mall.floors?.length || 0} Floors / {mall.categories?.length || 0} Categories</p>
                {mall.description && (
                  <p style={{marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.85rem'}}>{mall.description}</p>
                )}
              </div>

              <div className="data-actions">
                <button onClick={() => navigate(`/admin/view-mall/${mall.id}`)} className="btn btn-sm" style={{flex: 1}}>
                  Architecture
                </button>
                <button onClick={() => navigate(`/admin/edit-mall/${mall.id}`)} className="btn btn-sm btn-primary" style={{flex: 1}}>
                  Modify
                </button>
                <button onClick={() => handleDelete(mall.id, mall.mallName)} className="btn btn-sm btn-danger" style={{flex: 1}}>
                  Decommission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMalls;

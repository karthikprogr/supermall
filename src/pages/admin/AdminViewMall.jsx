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

  useEffect(() => {
    fetchMallDetails();
  }, [id]);

  const fetchMallDetails = async () => {
    try {
      // Fetch mall details
      const mallDoc = await getDoc(doc(db, 'malls', id));
      
      if (!mallDoc.exists()) {
        setError('Super Mall not found');
        setLoading(false);
        return;
      }

      const mallData = { id: mallDoc.id, ...mallDoc.data() };
      setMall(mallData);

      // Count merchants for this mall
      const merchantsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'merchant'),
        where('mallId', '==', id)
      );
      const merchantsSnapshot = await getDocs(merchantsQuery);
      setMerchantsCount(merchantsSnapshot.size);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching mall details:', error);
      setError('Failed to load mall details');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading mall details...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin/malls')} className="btn btn-secondary">
          Back to Malls
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Super Mall Details</h1>
        <div>
          <button 
            onClick={() => navigate(`/admin/edit-mall/${id}`)}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            Edit Mall
          </button>
          <button 
            onClick={() => navigate('/admin/malls')}
            className="btn btn-secondary"
          >
            Back to Malls
          </button>
        </div>
      </div>

      <div className="details-container">
        {/* Super Mall Information */}
        <div className="details-section">
          <h2>🏢 Super Mall Information</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Mall Name:</label>
              <p>{mall.mallName}</p>
            </div>
            <div className="detail-item">
              <label>Location:</label>
              <p>{mall.location}</p>
            </div>
            <div className="detail-item">
              <label>Description:</label>
              <p>{mall.description || 'No description provided'}</p>
            </div>
            <div className="detail-item">
              <label>Maximum Merchants:</label>
              <p>{mall.maxMerchants || 10}</p>
            </div>
            <div className="detail-item">
              <label>Current Merchants:</label>
              <p>{merchantsCount} / {mall.maxMerchants || 10}</p>
            </div>
            <div className="detail-item">
              <label>Created At:</label>
              <p>{new Date(mall.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Merchant Management */}
        <div className="details-section">
          <h2>👥 Merchant Management</h2>
          <div className="info-box">
            <p><strong>Current Merchants:</strong> {merchantsCount} of {mall.maxMerchants || 10} slots used</p>
            <p>Merchants are shop owners who can create and manage shops in this mall.</p>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => navigate('/admin/merchants')}
                className="btn btn-primary"
                style={{ marginRight: '0.5rem' }}
              >
                View All Merchants
              </button>
              {merchantsCount < (mall.maxMerchants || 10) && (
                <button
                  onClick={() => navigate('/admin/create-merchant')}
                  className="btn btn-success"
                >
                  Add Merchant
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mall Statistics */}
        <div className="details-section">
          <h2>📊 Mall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{merchantsCount}</h3>
              <p>Merchants</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Total Shops</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Categories</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Floors</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/admin/edit-mall/${id}`)}
            className="btn btn-primary"
          >
            Edit Mall Details
          </button>
          <button
            onClick={() => navigate('/admin/malls')}
            className="btn btn-secondary"
          >
            Back to All Malls
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewMall;

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

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      // Fetch shop details
      const shopDoc = await getDoc(doc(db, 'shops', id));
      
      if (!shopDoc.exists()) {
        setError('Shop not found');
        setLoading(false);
        return;
      }

      const shopData = { id: shopDoc.id, ...shopDoc.data() };
      setShop(shopData);

      // Fetch owner (merchant) details
      if (shopData.ownerId) {
        const ownerDoc = await getDoc(doc(db, 'users', shopData.ownerId));
        if (ownerDoc.exists()) {
          setOwner(ownerDoc.data());
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      setError('Failed to load shop details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${shop.shopName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'shops', id));
      alert('Shop deleted successfully!');
      navigate('/admin/shops');
    } catch (error) {
      console.error('Error deleting shop:', error);
      alert('Failed to delete shop: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading shop details...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin/shops')} className="btn btn-secondary">
          Back to Shops
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Shop Details</h1>
        <div>
          <button 
            onClick={() => navigate(`/admin/edit-shop/${id}`)}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            Edit Shop
          </button>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
            style={{ marginRight: '10px' }}
          >
            Delete Shop
          </button>
          <button 
            onClick={() => navigate('/admin/shops')}
            className="btn btn-secondary"
          >
            Back to Shops
          </button>
        </div>
      </div>

      <div className="details-container">
        {/* Shop Information */}
        <div className="details-section">
          <h2>🏪 Shop Information</h2>
          {shop.imageUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <img 
                src={shop.imageUrl} 
                alt={shop.shopName}
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
          <div className="details-grid">
            <div className="detail-item">
              <label>Shop Name:</label>
              <p>{shop.shopName}</p>
            </div>
            <div className="detail-item">
              <label>Category:</label>
              <p className="role-badge">{shop.category}</p>
            </div>
            <div className="detail-item">
              <label>Floor:</label>
              <p>{shop.floor}</p>
            </div>
            <div className="detail-item">
              <label>Contact Number:</label>
              <p>{shop.contactNumber || 'Not provided'}</p>
            </div>
            <div className="detail-item">
              <label>Description:</label>
              <p>{shop.description || 'No description provided'}</p>
            </div>
            <div className="detail-item">
              <label>Created At:</label>
              <p>{new Date(shop.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        {owner && (
          <div className="details-section">
            <h2>👤 Shop Owner (Merchant)</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Owner Name:</label>
                <p>{owner.name}</p>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <p className="credential-text">{owner.email}</p>
              </div>
              <div className="detail-item">
                <label>Contact Number:</label>
                <p>{owner.contactNumber || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>Role:</label>
                <p className="role-badge">{owner.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Shop Statistics */}
        <div className="details-section">
          <h2>📊 Shop Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>0</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Active Offers</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Total Sales</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Reviews</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/admin/edit-shop/${id}`)}
            className="btn btn-primary"
          >
            Edit Shop Details
          </button>
          <button
            onClick={() => navigate(`/merchant/add-product?shopId=${id}`)}
            className="btn btn-success"
          >
            Add Products to Shop
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Delete Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewShop;

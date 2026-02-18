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
      alert('Super Mall deleted successfully!');
    } catch (error) {
      console.error('Error deleting mall:', error);
      alert('Failed to delete super mall: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading super malls...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Super Malls</h1>
        <button 
          onClick={() => navigate('/admin/create-mall')} 
          className="btn btn-success"
        >
          + Create New Super Mall
        </button>
      </div>

      {malls.length === 0 ? (
        <div className="empty-state">
          <h2>No Super Malls Found</h2>
          <p>Create your first super mall to get started</p>
          <button 
            onClick={() => navigate('/admin/create-mall')}
            className="btn btn-primary"
          >
            Create First Super Mall
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {malls.map(mall => (
            <div key={mall.id} className="mall-card">
              <h3>{mall.mallName}</h3>
              <div className="mall-info">
                <p><strong>📍 Location:</strong> {mall.location}</p>
                <p><strong>👤 Merchant:</strong> {mall.merchantEmail}</p>
                <p><strong>📅 Created:</strong> {new Date(mall.createdAt).toLocaleDateString()}</p>
                {mall.description && (
                  <p><strong>📝 Description:</strong> {mall.description}</p>
                )}
              </div>
              <div className="mall-actions">
                <button
                  onClick={() => navigate(`/admin/view-mall/${mall.id}`)}
                  className="btn btn-sm btn-info"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/admin/edit-mall/${mall.id}`)}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mall.id, mall.mallName)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
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

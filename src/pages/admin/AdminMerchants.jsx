import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const merchantsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'merchant')
      );
      const merchantsSnapshot = await getDocs(merchantsQuery);
      const merchantsData = merchantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMerchants(merchantsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (merchantId, merchantName, mallId) => {
    if (!window.confirm(`Are you sure you want to delete merchant "${merchantName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Decrement merchant count in mall if mall exists
      if (mallId) {
        const mallDoc = await getDoc(doc(db, 'malls', mallId));
        if (mallDoc.exists()) {
          const currentCount = mallDoc.data().currentMerchants || 0;
          await updateDoc(doc(db, 'malls', mallId), {
            currentMerchants: Math.max(0, currentCount - 1)
          });
        }
      }

      // Delete merchant user document
      await deleteDoc(doc(db, 'users', merchantId));
      
      // Update local state
      setMerchants(merchants.filter(m => m.id !== merchantId));
    } catch (error) {
      console.error('Error deleting merchant:', error);
      alert('Failed to delete merchant');
    }
  };

  if (loading) {
    return <div className="loading">Loading merchants...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Merchants</h1>
        <button 
          onClick={() => navigate('/admin/create-merchant')} 
          className="btn btn-success"
        >
          + Create New Merchant
        </button>
      </div>

      {merchants.length === 0 ? (
        <div className="empty-state">
          <p>No merchants found</p>
          <button 
            onClick={() => navigate('/admin/create-merchant')}
            className="btn btn-primary"
          >
            Create First Merchant
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Mall</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map(merchant => (
                <tr key={merchant.id}>
                  <td>{merchant.name}</td>
                  <td>{merchant.email}</td>
                  <td>{merchant.contactNumber || 'N/A'}</td>
                  <td>{merchant.mallName || 'N/A'}</td>
                  <td>{new Date(merchant.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => navigate(`/admin/edit-merchant/${merchant.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(merchant.id, merchant.name, merchant.mallId)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMerchants;

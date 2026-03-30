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
      const merchantsQuery = query(collection(db, 'users'), where('role', '==', 'merchant'));
      const merchantsSnapshot = await getDocs(merchantsQuery);
      const merchantsData = merchantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMerchants(merchantsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (merchantId, merchantName, mallId) => {
    if (!window.confirm(`Are you sure you want to delete merchant "${merchantName}"?`)) return;
    try {
      if (mallId) {
        const mallRef = doc(db, 'malls', mallId);
        const mallDoc = await getDoc(mallRef);
        if (mallDoc.exists()) {
          await updateDoc(mallRef, { currentMerchants: Math.max(0, (mallDoc.data().currentMerchants || 0) - 1) });
        }
      }
      await deleteDoc(doc(db, 'users', merchantId));
      setMerchants(merchants.filter(m => m.id !== merchantId));
    } catch (error) {
      console.error('Error deleting merchant:', error);
    }
  };

  if (loading) return <div className="loading">Loading merchant directory...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem'}}>
        <div>
          <h1 className="primary-gradient-text">Merchant Directory</h1>
          <p className="subtitle" style={{marginTop: '0.5rem'}}>Manage verified retail partners and their access credentials</p>
        </div>
        <button onClick={() => navigate('/admin/create-merchant')} className="btn btn-primary btn-large">
          + Onboard New Merchant
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Retail Partner</th>
              <th>Infrastructure</th>
              <th>Credentials</th>
              <th>Onboarded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '4rem', color: 'var(--text-dim)'}}>No retail partners registered in the system.</td>
              </tr>
            ) : (
              merchants.map(merchant => (
                <tr key={merchant.id}>
                  <td>
                    <div style={{fontWeight: 800, fontSize: '1.1rem'}}>{merchant.name}</div>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>{merchant.contactNumber}</div>
                  </td>
                  <td>
                    <div style={{color: 'var(--primary)', fontWeight: 700}}>{merchant.mallName || 'Unassigned'}</div>
                    <div style={{fontSize: '0.75rem', opacity: 0.6}}>MALL_IDENTIFIER: {merchant.mallId?.slice(0,6) || 'N/A'}</div>
                  </td>
                  <td>
                    <div style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>{merchant.email}</div>
                  </td>
                  <td>{new Date(merchant.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button onClick={() => navigate(`/admin/edit-merchant/${merchant.id}`)} className="btn btn-sm btn-primary">Edit</button>
                      <button onClick={() => handleDelete(merchant.id, merchant.name, merchant.mallId)} className="btn btn-sm btn-danger">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMerchants;

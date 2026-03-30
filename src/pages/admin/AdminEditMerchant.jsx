import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRequired, validateEmail } from '../../utils/validation';

const AdminEditMerchant = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', contactNumber: '', mallId: '' });
  const [merchant, setMerchant] = useState(null);
  const [malls, setMalls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => { fetchMalls(); fetchMerchant(); }, [merchantId]);

  const fetchMalls = async () => {
    try {
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      setMalls(mallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
  };

  const fetchMerchant = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', merchantId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMerchant(data);
        setFormData({ name: data.name, email: data.email, contactNumber: data.contactNumber || '', mallId: data.mallId || '' });
      } else setError('Merchant not found.');
      setFetchLoading(false);
    } catch (err) { setError('Failed to load credentials.'); setFetchLoading(false); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateRequired(formData.name)) return setError('Name is required.');

    setLoading(true);
    try {
      const oldMallId = merchant.mallId;
      const newMallId = formData.mallId;
      let mallName = merchant.mallName;

      if (newMallId && newMallId !== oldMallId) {
        const newMallDoc = await getDoc(doc(db, 'malls', newMallId));
        if (newMallDoc.exists()) {
          const newMallData = newMallDoc.data();
          if ((newMallData.currentMerchants || 0) >= (newMallData.maxMerchants || 10)) throw new Error('New mall capacity reached.');
          mallName = newMallData.mallName;
          await updateDoc(doc(db, 'malls', newMallId), { currentMerchants: (newMallData.currentMerchants || 0) + 1 });
          if (oldMallId) {
             const oldMallRef = doc(db, 'malls', oldMallId);
             const oldMallDoc = await getDoc(oldMallRef);
             if(oldMallDoc.exists()) await updateDoc(oldMallRef, { currentMerchants: Math.max(0, (oldMallDoc.data().currentMerchants || 0) - 1) });
          }
        }
      }

      await updateDoc(doc(db, 'users', merchantId), { ...formData, mallName, updatedAt: new Date().toISOString() });
      setSuccess('Merchant profile synchronized successfully!');
      setTimeout(() => navigate('/admin/merchants'), 1500);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  if (fetchLoading) return <div className="loading">Retrieving Merchant Profile...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Manage Credentials</h1>
        <p className="subtitle">Update verified retailer identity and infrastructure access</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Verified Identity *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Registered Email</label>
                <input type="email" value={formData.email} disabled style={{opacity: 0.6}} />
                <small className="input-hint">Protocol: Immutable Login Email.</small>
              </div>

              <div className="form-group">
                <label>Reference Password</label>
                <input type="text" value={merchant?.adminViewPassword || 'ENCRYPTED'} disabled style={{opacity: 0.6, fontFamily: 'monospace'}} />
                <small className="input-hint">Vault reference for administrative support only.</small>
              </div>

              <div className="form-group">
                <label>Contact Protocol</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Infrastructure Assignment</label>
                <select name="mallId" value={formData.mallId} onChange={handleChange}>
                  <option value="">Detached / No Assignment</option>
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.mallName} ({mall.currentMerchants || 0}/{mall.maxMerchants || 10})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/admin/merchants')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Processing...' : 'Sync Revisions'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMerchant;

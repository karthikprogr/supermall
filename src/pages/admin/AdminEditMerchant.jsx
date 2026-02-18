import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRequired, validateEmail } from '../../utils/validation';

const AdminEditMerchant = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    mallId: ''
  });
  const [merchant, setMerchant] = useState(null);
  const [malls, setMalls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const { merchantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
    fetchMerchant();
  }, [merchantId]);

  const fetchMalls = async () => {
    try {
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      const mallsData = mallsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMalls(mallsData);
    } catch (error) {
      console.error('Error fetching malls:', error);
    }
  };

  const fetchMerchant = async () => {
    try {
      const merchantDoc = await getDoc(doc(db, 'users', merchantId));
      if (merchantDoc.exists()) {
        const data = merchantDoc.data();
        setMerchant(data);
        setFormData({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber || '',
          mallId: data.mallId || ''
        });
      } else {
        setError('Merchant not found');
      }
      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching merchant:', error);
      setError('Failed to load merchant data');
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!validateRequired(formData.name)) {
      setError('Name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const oldMallId = merchant.mallId;
      const newMallId = formData.mallId;
      
      // Get mall name if mall changed
      let mallName = merchant.mallName;
      if (newMallId && newMallId !== oldMallId) {
        // Validate new mall merchant limit
        const newMallDoc = await getDoc(doc(db, 'malls', newMallId));
        if (newMallDoc.exists()) {
          const newMallData = newMallDoc.data();
          const currentMerchants = newMallData.currentMerchants || 0;
          const maxMerchants = newMallData.maxMerchants || 10;
          
          if (currentMerchants >= maxMerchants) {
            setError(`Selected mall has reached its maximum merchant limit (${maxMerchants})`);
            setLoading(false);
            return;
          }
          
          mallName = newMallData.mallName;
          
          // Increment new mall count
          await updateDoc(doc(db, 'malls', newMallId), {
            currentMerchants: currentMerchants + 1
          });
          
          // Decrement old mall count
          if (oldMallId) {
            const oldMallDoc = await getDoc(doc(db, 'malls', oldMallId));
            if (oldMallDoc.exists()) {
              const oldCount = oldMallDoc.data().currentMerchants || 0;
              await updateDoc(doc(db, 'malls', oldMallId), {
                currentMerchants: Math.max(0, oldCount - 1)
              });
            }
          }
        }
      }

      await updateDoc(doc(db, 'users', merchantId), {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        mallId: formData.mallId || null,
        mallName: mallName || null,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Merchant updated successfully!');
      setTimeout(() => {
        navigate('/admin/merchants');
      }, 1500);
    } catch (error) {
      console.error('Error updating merchant:', error);
      setError('Failed to update merchant');
    }

    setLoading(false);
  };

  if (fetchLoading) {
    return <div className="loading">Loading merchant data...</div>;
  }

  return (
    <div className="page-container">
      <h1>Edit Merchant</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2>Merchant Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Merchant Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter merchant name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              disabled
            />
            <small>Email cannot be changed</small>
          </div>

          {merchant?.adminViewPassword && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-display">
                <input
                  type="text"
                  id="password"
                  value={merchant.adminViewPassword}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', cursor: 'default' }}
                />
                <small>🔑 Password stored for admin reference only</small>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mallId">Assigned Mall</label>
            <select
              id="mallId"
              name="mallId"
              value={formData.mallId}
              onChange={handleChange}
            >
              <option value="">No mall assigned</option>
              {malls.map(mall => (
                <option key={mall.id} value={mall.id}>
                  {mall.mallName} - {mall.location}
                  ({mall.currentMerchants || 0}/{mall.maxMerchants || 10} merchants)
                </option>
              ))}
            </select>
            <small>Change which mall this merchant can create shops in</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Merchant'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/merchants')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditMerchant;

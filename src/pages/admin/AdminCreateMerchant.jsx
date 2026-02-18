import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logAuth } from '../../utils/logger';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const AdminCreateMerchant = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    mallId: ''
  });
  const [malls, setMalls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  
  const { currentUser } = useAuth();
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
    } catch (error) {
      console.error('Error fetching malls:', error);
      setError('Failed to load malls');
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

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!validateRequired(formData.mallId)) {
      setError('Please select a super mall');
      return;
    }

    setLoading(true);

    try {
      // Get selected mall to check merchant limit
      const mallDoc = await getDoc(doc(db, 'malls', formData.mallId));
      if (!mallDoc.exists()) {
        setError('Selected mall not found');
        setLoading(false);
        return;
      }

      const mallData = mallDoc.data();
      const currentMerchants = mallData.currentMerchants || 0;
      const maxMerchants = mallData.maxMerchants || 10;

      if (currentMerchants >= maxMerchants) {
        setError(`This mall has reached its maximum merchant limit (${maxMerchants})`);
        setLoading(false);
        return;
      }

      // Check if email already exists
      const usersQuery = query(collection(db, 'users'), where('email', '==', formData.email));
      const existingUsers = await getDocs(usersQuery);
      
      if (!existingUsers.empty) {
        setError('Email already exists');
        setLoading(false);
        return;
      }

      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Create user document in Firestore with user.uid as document ID
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        role: 'merchant',
        mallId: formData.mallId,
        mallName: mallData.mallName,
        adminViewPassword: formData.password, // Store for admin viewing
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });

      // Increment merchant count in mall
      await updateDoc(doc(db, 'malls', formData.mallId), {
        currentMerchants: currentMerchants + 1
      });

      // Log merchant creation
      await logAuth.register(user.uid, formData.email, 'merchant');

      // Show success with credentials
      setCreatedCredentials({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mallName: mallData.mallName
      });
      setSuccess('Merchant account created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        contactNumber: '',
        mallId: ''
      });
    } catch (error) {
      console.error('Error creating merchant:', error);
      setError(error.message || 'Failed to create merchant account');
    }

    setLoading(false);
  };

  const handleCreateAnother = () => {
    setCreatedCredentials(null);
    setSuccess('');
  };

  if (createdCredentials) {
    return (
      <div className="page-container">
        <h1>Merchant Account Created!</h1>
        
        <div className="success-card">
          <h2>✅ Merchant Account Created Successfully</h2>
          
          <div className="credentials-box">
            <div className="credential-item">
              <strong>Merchant Name:</strong>
              <code>{createdCredentials.name}</code>
            </div>
            <div className="credential-item">
              <strong>Email:</strong>
              <code>{createdCredentials.email}</code>
            </div>
            <div className="credential-item">
              <strong>Password:</strong>
              <code>{createdCredentials.password}</code>
            </div>
            <div className="credential-item">
              <strong>Assigned Mall:</strong>
              <code>{createdCredentials.mallName}</code>
            </div>
          </div>

          <div className="info-box">
            <p>⚠️ <strong>Important:</strong> Save these credentials! The merchant will use them to login.</p>
            <p>📧 Send these credentials to the merchant securely.</p>
            <p>🏢 Merchant can now create and manage shops in {createdCredentials.mallName}.</p>
            <p>🔑 You can view the password anytime by editing the merchant details.</p>
          </div>

          <div className="form-actions">
            <button 
              onClick={handleCreateAnother}
              className="btn btn-primary"
            >
              Create Another Merchant
            </button>
            <button 
              onClick={() => navigate('/admin/merchants')}
              className="btn btn-secondary"
            >
              View All Merchants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Create Merchant Account</h1>
      <p className="page-subtitle">Create a merchant (shop owner) account and assign to a super mall</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2>Merchant Details</h2>
          
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
              placeholder="merchant@example.com"
              required
            />
            <small>Merchant will use this email to login</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password (min 6 characters)"
              required
            />
            <small>You can view this password later when editing the merchant</small>
          </div>

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
            <label htmlFor="mallId">Assign to Super Mall *</label>
            <select
              id="mallId"
              name="mallId"
              value={formData.mallId}
              onChange={handleChange}
              required
            >
              <option value="">Select a super mall</option>
              {malls.map(mall => (
                <option key={mall.id} value={mall.id}>
                  {mall.mallName} - {mall.location} 
                  ({mall.currentMerchants || 0}/{mall.maxMerchants || 10} merchants)
                </option>
              ))}
            </select>
            <small>Merchant will be able to create shops in this mall</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Merchant'}
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

export default AdminCreateMerchant;

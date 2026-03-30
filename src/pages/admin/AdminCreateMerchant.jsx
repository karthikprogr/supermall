import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logAuth } from '../../utils/logger';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const AdminCreateMerchant = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contactNumber: '', mallId: '' });
  const [malls, setMalls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchMalls(); }, []);

  const fetchMalls = async () => {
    try {
      const mallsSnapshot = await getDocs(collection(db, 'malls'));
      setMalls(mallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { setError('Failed to load malls'); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateRequired(formData.name)) return setError('Name is required');
    if (!validateEmail(formData.email)) return setError('Invalid email address');
    if (!validatePassword(formData.password)) return setError('Password min 6 chars');
    if (!validateRequired(formData.mallId)) return setError('Select a mall');

    setLoading(true);
    try {
      const mallRef = doc(db, 'malls', formData.mallId);
      const mallDoc = await getDoc(mallRef);
      if (!mallDoc.exists()) throw new Error('Mall not found');
      
      const mallData = mallDoc.data();
      if ((mallData.currentMerchants || 0) >= (mallData.maxMerchants || 10)) {
        throw new Error('Mall capacity reached');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        role: 'merchant',
        mallName: mallData.mallName,
        adminViewPassword: formData.password,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });

      await updateDoc(mallRef, { currentMerchants: (mallData.currentMerchants || 0) + 1 });
      await logAuth.register(user.uid, formData.email, 'merchant');

      setCreatedCredentials({ ...formData, mallName: mallData.mallName });
      setSuccess('Merchant onboarded successfully!');
    } catch (err) {
      const cleanError = err.message
        .replace('Firebase: ', '')
        .replace(/\(auth.*\)\./, '')
        .replace('Error ', '');
      setError(cleanError || 'Failed to provision merchant credentials.');
    }
    setLoading(false);
  };

  if (createdCredentials) {
    return (
      <div className="admin-page container section-padding">
        <div className="page-header text-center">
          <h1 className="primary-gradient-text">Onboarding Complete</h1>
          <p className="subtitle">Merchant credentials generated successfully</p>
        </div>
        <div className="form-card-wrapper">
          <div className="form-glass-card glass-card text-center">
            <div className="credential-display-grid" style={{textAlign: 'left', marginBottom: '3rem'}}>
              <div className="stat-card" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem'}}>
                <p className="stat-label">Merchant Identity</p>
                <h4 style={{fontSize: '1.5rem'}}>{createdCredentials.name}</h4>
              </div>
              <div className="stat-card" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem'}}>
                <p className="stat-label">Access Email</p>
                <code style={{fontSize: '1.1rem', color: 'var(--primary)'}}>{createdCredentials.email}</code>
              </div>
              <div className="stat-card" style={{padding: '1.5rem', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem'}}>
                <p className="stat-label">Vault Password</p>
                <code style={{fontSize: '1.1rem', color: 'var(--accent)'}}>{createdCredentials.password}</code>
              </div>
            </div>
            <div className="form-footer-actions" style={{justifyContent: 'center'}}>
               <button onClick={() => navigate('/admin/merchants')} className="btn btn-secondary">Merchant List</button>
               <button onClick={() => setCreatedCredentials(null)} className="btn btn-primary">Onboard Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Onboard Retail Partner</h1>
        <p className="subtitle">Register a new merchant and assign infrastructure access</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Legal Name / Identity *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name or company identity" required />
              </div>

              <div className="form-group">
                <label>Login Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="merchant@business.com" required />
              </div>

              <div className="form-group">
                <label>Vault Password *</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Strategic password (min 6 chars)" required />
                <small className="input-hint">Security: Avoid simple patterns like '123456'.</small>
              </div>

              <div className="form-group">
                <label>Contact Protocol</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>

              <div className="form-group">
                <label>Infrastructure Assignment *</label>
                <select name="mallId" value={formData.mallId} onChange={handleChange} required>
                  <option value="">Select Target Mall</option>
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.mallName} ({mall.currentMerchants || 0}/{mall.maxMerchants || 10})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/admin/merchants')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Processing...' : 'Provision Account'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateMerchant;

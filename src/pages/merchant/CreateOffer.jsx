import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logOffer } from '../../utils/logger';
import { validateRequired, validateDiscount } from '../../utils/validation';

const CreateOffer = () => {
  const [formData, setFormData] = useState({ productId: '', discount: '', validTill: '', description: '' });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
      const params = new URLSearchParams(location.search);
      const preSelectedId = params.get('productId');
      if (preSelectedId) setFormData(prev => ({ ...prev, productId: preSelectedId }));
    }
  }, [currentUser, location]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), where('ownerId', '==', currentUser.uid));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateRequired(formData.productId)) return setError('Product selection required');
    if (!validateDiscount(formData.discount)) return setError('Discount must be 0-100');
    if (!validateRequired(formData.validTill)) return setError('Validity date required');

    setLoading(true);
    try {
      const offerData = { ...formData, discount: parseFloat(formData.discount), ownerId: currentUser.uid, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'offers'), offerData);
      await logOffer.create(currentUser.uid, `${formData.discount}% campaign`, docRef.id);
      navigate('/merchant/products');
    } catch (err) { setError('Failed to launch campaign.'); }
    setLoading(false);
  };

  if (products.length === 0) {
    return (
      <div className="admin-page container section-padding text-center">
        <h2 className="primary-gradient-text">Zero Inventory Assets</h2>
        <p className="subtitle">You must catalog products before launching marketing campaigns.</p>
        <button onClick={() => navigate('/merchant/products/add')} className="btn btn-primary" style={{marginTop: '2rem'}}>Provision Products</button>
      </div>
    );
  }

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Launch Marketing Campaign</h1>
        <p className="subtitle">Deploy specialized pricing protocols to boost item high-performance sales</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Target Inventory Asset *</label>
                <select name="productId" value={formData.productId} onChange={handleChange} required>
                  <option value="">Select Target Asset</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Discount Threshold (%) *</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="0-100" min="0" max="100" step="1" required />
              </div>

              <div className="form-group">
                <label>Campaign Expiration *</label>
                <input type="date" name="validTill" value={formData.validTill} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
              </div>

              <div className="form-group full-width">
                <label>Campaign Narrative / Terms</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Seasonal discount, limited time offer, etc..." rows="3" />
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/merchant/products')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Launching...' : 'Activate Campaign'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';
import { validateRequired, validatePrice, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', price: '', features: '', shopId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) fetchShops(); }, [currentUser]);

  const fetchShops = async () => {
    try {
      const q = query(collection(db, 'shops'), where('ownerId', '==', currentUser.uid));
      const snap = await getDocs(q);
      setShops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImageFile(file)) setImageFile(file);
    else if(file) setError('Invalid image format.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateRequired(formData.name)) return setError('Product name required');
    if (!validatePrice(formData.price)) return setError('Invalid price');
    if (!validateRequired(formData.shopId)) return setError('Primary shop assignment required');

    setLoading(true);
    try {
      let imageURL = '';
      if (imageFile) imageURL = await uploadImageToCloudinary(imageFile);
      const productData = { ...formData, price: parseFloat(formData.price), imageURL, ownerId: currentUser.uid, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'products'), productData);
      await logProduct.add(currentUser.uid, formData.name, docRef.id, formData.shopId);
      navigate('/merchant/products');
    } catch (err) { setError('Failed to catalog product.'); }
    setLoading(false);
  };

  if (shops.length === 0) {
    return (
      <div className="admin-page container section-padding text-center">
        <h2 className="primary-gradient-text">No Operational Shops</h2>
        <p className="subtitle">You must initialize a storefront before provisioning inventory.</p>
        <button onClick={() => navigate('/merchant/shops/create')} className="btn btn-primary" style={{marginTop: '2rem'}}>Deploy First Shop</button>
      </div>
    );
  }

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Catalog New Asset</h1>
        <p className="subtitle">Provision a new product to your operational retail infrastructure</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Product Designation *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Official product name" required />
              </div>

              <div className="form-group">
                <label>Valuation (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" placeholder="0.00" required />
              </div>

              <div className="form-group">
                <label>Target Storefront *</label>
                <select name="shopId" value={formData.shopId} onChange={handleChange} required>
                  <option value="">Select Target Shop</option>
                  {shops.map(shop => <option key={shop.id} value={shop.id}>{shop.shopName}</option>)}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Technical Specifications / Features</label>
                <textarea name="features" value={formData.features} onChange={handleChange} placeholder="Specifications, dimensions, or unique features..." rows="3" />
              </div>

              <div className="form-group full-width">
                <label>Visual Identity Asset</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                <small className="input-hint">High-fidelity display image (Max 5MB).</small>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/merchant/products')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Provisioning...' : 'Catalog Product'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

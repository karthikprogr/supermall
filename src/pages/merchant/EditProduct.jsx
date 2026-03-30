import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';
import { validateRequired, validatePrice, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const EditProduct = () => {
  const [formData, setFormData] = useState({ name: '', price: '', features: '', shopId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState('');
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => { if (currentUser) fetchShopsAndProduct(); }, [currentUser, productId]);

  const fetchShopsAndProduct = async () => {
    try {
      const shopsQ = query(collection(db, 'shops'), where('ownerId', '==', currentUser.uid));
      const shopsSnap = await getDocs(shopsQ);
      setShops(shopsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const data = productDoc.data();
        setFormData({ name: data.name, price: data.price, features: data.features || '', shopId: data.shopId });
        setCurrentImageURL(data.imageURL || '');
      } else setError('Product not found');
      setPageLoading(false);
    } catch (error) { setError('Failed to load product'); setPageLoading(false); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImageFile(file)) { setImageFile(file); setError(''); }
    else if(file) setError('Invalid image format (JPG/PNG < 5MB).');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateRequired(formData.name)) return setError('Product name required');
    if (!validatePrice(formData.price)) return setError('Invalid valuation');

    setLoading(true);
    try {
      let imageURL = currentImageURL;
      if (imageFile) imageURL = await uploadImageToCloudinary(imageFile);

      await updateDoc(doc(db, 'products', productId), { ...formData, price: parseFloat(formData.price), imageURL, updatedAt: new Date().toISOString() });
      await logProduct.edit(currentUser.uid, formData.name, productId, formData.shopId);
      navigate('/merchant/products');
    } catch (error) { setError('Failed to sync product changes.'); }
    setLoading(false);
  };

  if (pageLoading) return <div className="loading">Retrieving Asset Metadata...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Sync Retail Asset</h1>
        <p className="subtitle">Modify the technical profile of a registered product in your inventory</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Asset Designation *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Price Point (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required />
              </div>

              <div className="form-group">
                <label>Operational Storefront *</label>
                <select name="shopId" value={formData.shopId} onChange={handleChange} required>
                  {shops.map(shop => <option key={shop.id} value={shop.id}>{shop.shopName}</option>)}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Technical Specifications</label>
                <textarea name="features" value={formData.features} onChange={handleChange} rows="3" />
              </div>

              <div className="form-group full-width">
                <label>Current Visual Identity</label>
                {currentImageURL ? (
                  <div style={{width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginBottom: '1.5rem'}}>
                    <img src={currentImageURL} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                ) : <p style={{color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>No image currently associated with this asset.</p>}
                
                <label>Overwrite Identity Asset</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                <small className="input-hint">Leave blank to retain current visual metadata.</small>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/merchant/products')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Syncing...' : 'Save Asset Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

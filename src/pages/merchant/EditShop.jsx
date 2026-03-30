import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logShop } from '../../utils/logger';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const EditShop = () => {
  const [formData, setFormData] = useState({ shopName: '', category: '', floor: '', description: '', contactNumber: '', customCategory: '', customFloor: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState('');
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomFloor, setShowCustomFloor] = useState(false);
  
  const predefinedCategories = ['Electronics', 'Fashion & Apparel', 'Food & Beverages', 'Books & Stationery', 'Sports & Fitness', 'Beauty & Cosmetics', 'Home & Garden', 'Toys & Games', 'Jewelry & Accessories', 'Health & Wellness', 'Furniture', 'Grocery & Supermarket'];
  const predefinedFloors = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor', 'Basement Level 1', 'Basement Level 2', 'Food Court Level', 'Terrace Level'];
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => { fetchMetadataAndShop(); }, [id]);

  const fetchMetadataAndShop = async () => {
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      setCategories(catSnap.docs.map(doc => doc.data().name));
      const flSnap = await getDocs(collection(db, 'floors'));
      setFloors(flSnap.docs.map(doc => doc.data().name));

      const shopDoc = await getDoc(doc(db, 'shops', id));
      if (shopDoc.exists()) {
        const data = shopDoc.data();
        const isCustomCat = !predefinedCategories.includes(data.category) && !categories.includes(data.category);
        const isCustomFloor = !predefinedFloors.includes(data.floor) && !floors.includes(data.floor);
        
        setFormData({
          shopName: data.shopName,
          category: isCustomCat ? 'Other' : data.category,
          customCategory: isCustomCat ? data.category : '',
          floor: isCustomFloor ? 'Other' : data.floor,
          customFloor: isCustomFloor ? data.floor : '',
          description: data.description || '',
          contactNumber: data.contactNumber || ''
        });
        setCurrentImageURL(data.imageURL || '');
        setShowCustomCategory(isCustomCat);
        setShowCustomFloor(isCustomFloor);
      } else setError('Storefront not found');
      setPageLoading(false);
    } catch (err) { setError('Failed to load store data'); setPageLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setShowCustomCategory(value === 'Other');
      setFormData({ ...formData, category: value, customCategory: value === 'Other' ? formData.customCategory : '' });
    } else if (name === 'floor') {
      setShowCustomFloor(value === 'Other');
      setFormData({ ...formData, floor: value, customFloor: value === 'Other' ? formData.customFloor : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImageFile(file)) { setImageFile(file); setError(''); }
    else if(file) setError('Invalid image format (JPG/PNG < 5MB).');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateRequired(formData.shopName)) return setError('Shop name is required');

    setLoading(true);
    try {
      let imageURL = currentImageURL;
      if (imageFile) imageURL = await uploadImageToCloudinary(imageFile);

      const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
      const finalFloor = formData.floor === 'Other' ? formData.customFloor : formData.floor;

      const shopData = { ...formData, category: finalCategory, floor: finalFloor, imageURL, updatedAt: new Date().toISOString() };
      delete shopData.customCategory; delete shopData.customFloor;

      await updateDoc(doc(db, 'shops', id), shopData);
      await logShop.edit(currentUser.uid, formData.shopName, id);
      navigate('/merchant/shops');
    } catch (err) { setError('Failed to sync changes.'); }
    setLoading(false);
  };

  if (pageLoading) return <div className="loading">Retrieving Storefront Profile...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Sync Storefront Meta</h1>
        <p className="subtitle">Modify the architectural profile of your retail environment</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Store Personality / Name *</label>
                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Market Segment *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  {predefinedCategories.concat(categories).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vertical Floor Level *</label>
                <select name="floor" value={formData.floor} onChange={handleChange} required>
                  {predefinedFloors.concat(floors).map((fl, i) => <option key={i} value={fl}>{fl}</option>)}
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>

              {showCustomCategory && (
                <div className="form-group full-width">
                  <label>Define Custom Category *</label>
                  <input type="text" name="customCategory" value={formData.customCategory} onChange={handleChange} required />
                </div>
              )}

              {showCustomFloor && (
                <div className="form-group full-width">
                  <label>Define Custom Level *</label>
                  <input type="text" name="customFloor" value={formData.customFloor} onChange={handleChange} required />
                </div>
              )}

              <div className="form-group full-width">
                <label>Storefront Narrative</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
              </div>

              <div className="form-group">
                <label>Protocol / Contact Number</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Visual Identity Preview</label>
                {currentImageURL && (
                  <div style={{width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginBottom: '1.5rem'}}>
                    <img src={currentImageURL} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                )}
                <label>Overwrite Image Asset</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                <small className="input-hint">Leave blank to retain current brand asset.</small>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/merchant/shops')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Syncing...' : 'Save Revisions'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShop;

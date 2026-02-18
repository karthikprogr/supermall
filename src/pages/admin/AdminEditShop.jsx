import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AdminEditShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    floor: '',
    description: '',
    contactNumber: '',
    ownerEmail: '',
    imageURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const { shopId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [shopId]);

  const fetchData = async () => {
    try {
      // Fetch shop data
      const shopDoc = await getDoc(doc(db, 'shops', shopId));
      if (shopDoc.exists()) {
        const data = shopDoc.data();
        setFormData({
          shopName: data.shopName,
          category: data.category,
          floor: data.floor,
          description: data.description || '',
          contactNumber: data.contactNumber || '',
          ownerEmail: data.ownerEmail,
          imageURL: data.imageURL || ''
        });
      } else {
        setError('Shop not found');
      }

      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesData);

      // Fetch floors
      const floorsSnapshot = await getDocs(collection(db, 'floors'));
      const floorsData = floorsSnapshot.docs.map(doc => doc.data().name);
      setFloors(floorsData);

      // Fetch merchants
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const merchantsData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'merchant');
      setMerchants(merchantsData);

      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load shop data');
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateImageFile(file)) {
        setError('Invalid image file. Must be JPG, PNG, GIF, or WEBP and under 5MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!validateRequired(formData.shopName)) {
      setError('Shop name is required');
      return;
    }

    if (!validateRequired(formData.category)) {
      setError('Category is required');
      return;
    }

    if (!validateRequired(formData.floor)) {
      setError('Floor is required');
      return;
    }

    setLoading(true);

    try {
      let imageURL = formData.imageURL;

      // Upload new image if provided
      if (imageFile) {
        imageURL = await uploadImageToCloudinary(imageFile);
      }

      // Find merchant owner ID
      const merchant = merchants.find(m => m.email === formData.ownerEmail);
      if (!merchant) {
        setError('Merchant not found');
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, 'shops', shopId), {
        shopName: formData.shopName,
        category: formData.category,
        floor: formData.floor,
        description: formData.description,
        contactNumber: formData.contactNumber,
        ownerEmail: formData.ownerEmail,
        ownerId: merchant.id,
        imageURL,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Shop updated successfully!');
      setTimeout(() => {
        navigate('/admin/shops');
      }, 1500);
    } catch (error) {
      console.error('Error updating shop:', error);
      setError('Failed to update shop');
    }

    setLoading(false);
  };

  if (fetchLoading) {
    return <div className="loading">Loading shop data...</div>;
  }

  return (
    <div className="page-container">
      <h1>Edit Shop</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Shop Name *</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Enter shop name"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Floor *</label>
          <select
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Select Floor</option>
            {floors.map((floor, index) => (
              <option key={index} value={floor}>{floor}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Assign to Merchant *</label>
          <select
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Select Merchant</option>
            {merchants.map((merchant) => (
              <option key={merchant.id} value={merchant.email}>
                {merchant.name} ({merchant.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter shop description"
            className="textarea-field"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Shop Image</label>
          {formData.imageURL && (
            <div className="current-image">
              <img src={formData.imageURL} alt="Current shop" style={{ maxWidth: '200px', marginBottom: '0.5rem' }} />
              <p className="help-text">Current image (upload new to replace)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {imageFile && (
            <p className="file-info">New image: {imageFile.name}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Shop'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/shops')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditShop;

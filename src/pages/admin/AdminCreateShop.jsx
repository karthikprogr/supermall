import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logShop } from '../../utils/logger';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AdminCreateShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    floor: '',
    description: '',
    contactNumber: '',
    ownerEmail: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching data:', error);
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

    if (!validateRequired(formData.ownerEmail)) {
      setError('Please select a merchant owner');
      return;
    }

    setLoading(true);

    try {
      let imageURL = '';

      // Upload image if provided
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

      const shopData = {
        ...formData,
        imageURL,
        ownerId: merchant.id,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      };

      const docRef = await addDoc(collection(db, 'shops'), shopData);
      
      await logShop.create(currentUser.uid, formData.shopName, docRef.id);
      
      navigate('/admin/shops');
    } catch (error) {
      console.error('Error creating shop:', error);
      setError('Failed to create shop');
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1>Create New Shop</h1>
      
      {error && <div className="error-message">{error}</div>}
      
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
          <small>Shop will be assigned to this merchant</small>
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {imageFile && (
            <p className="file-info">Selected: {imageFile.name}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Shop'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateShop;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logShop } from '../../utils/logger';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const CreateShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    floor: '',
    description: '',
    contactNumber: '',
    customCategory: '',
    customFloor: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [merchantData, setMerchantData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomFloor, setShowCustomFloor] = useState(false);
  
  // Predefined options
  const predefinedCategories = [
    'Electronics',
    'Fashion & Apparel',
    'Food & Beverages',
    'Books & Stationery',
    'Sports & Fitness',
    'Beauty & Cosmetics',
    'Home & Garden',
    'Toys & Games',
    'Jewelry & Accessories',
    'Health & Wellness',
    'Furniture',
    'Grocery & Supermarket'
  ];
  
  const predefinedFloors = [
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Fifth Floor',
    'Basement Level 1',
    'Basement Level 2',
    'Food Court Level',
    'Terrace Level'
  ];
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoriesAndFloors();
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    try {
      const merchantDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (merchantDoc.exists()) {
        setMerchantData(merchantDoc.data());
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      setError('Failed to load merchant information');
    }
  };

  const fetchCategoriesAndFloors = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesData);

      const floorsSnapshot = await getDocs(collection(db, 'floors'));
      const floorsData = floorsSnapshot.docs.map(doc => doc.data().name);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if "Other" is selected for category or floor
    if (name === 'category') {
      setShowCustomCategory(value === 'Other');
      if (value !== 'Other') {
        setFormData({ ...formData, category: value, customCategory: '' });
      } else {
        setFormData({ ...formData, category: value });
      }
    } else if (name === 'floor') {
      setShowCustomFloor(value === 'Other');
      if (value !== 'Other') {
        setFormData({ ...formData, floor: value, customFloor: '' });
      } else {
        setFormData({ ...formData, floor: value });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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

    // Validate category
    if (!validateRequired(formData.category)) {
      setError('Category is required');
      return;
    }
    
    if (formData.category === 'Other' && !validateRequired(formData.customCategory)) {
      setError('Please enter a custom category');
      return;
    }

    // Validate floor
    if (!validateRequired(formData.floor)) {
      setError('Floor is required');
      return;
    }
    
    if (formData.floor === 'Other' && !validateRequired(formData.customFloor)) {
      setError('Please enter a custom floor');
      return;
    }

    // Check if merchant has assigned mall
    if (!merchantData?.mallId) {
      setError('You must be assigned to a mall before creating shops. Please contact the admin.');
      return;
    }

    setLoading(true);

    try {
      let imageURL = '';

      // Upload image if provided
      if (imageFile) {
        imageURL = await uploadImageToCloudinary(imageFile);
      }

      // Use custom values if "Other" is selected
      const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
      const finalFloor = formData.floor === 'Other' ? formData.customFloor : formData.floor;

      const shopData = {
        shopName: formData.shopName,
        category: finalCategory,
        floor: finalFloor,
        description: formData.description,
        contactNumber: formData.contactNumber,
        imageURL,
        ownerId: currentUser.uid,
        mallId: merchantData.mallId,
        mallName: merchantData.mallName,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'shops'), shopData);
      
      await logShop.create(currentUser.uid, formData.shopName, docRef.id);
      
      navigate('/merchant/shops');
    } catch (error) {
      console.error('Error creating shop:', error);
      setError('Failed to create shop');
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1>Create New Shop</h1>
      
      {merchantData?.mallName && (
        <div className="info-box" style={{ marginBottom: '1rem' }}>
          <p>🏢 <strong>Mall:</strong> {merchantData.mallName}</p>
          <small>This shop will be created in the assigned mall</small>
        </div>
      )}
      
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
            {predefinedCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
            {categories.map((cat, index) => (
              <option key={`db-${index}`} value={cat}>{cat}</option>
            ))}
            <option value="Other">Other (Custom)</option>
          </select>
        </div>

        {showCustomCategory && (
          <div className="form-group">
            <label>Custom Category *</label>
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="Enter custom category"
              className="input-field"
              required
            />
          </div>
        )}

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
            {predefinedFloors.map((floor, index) => (
              <option key={index} value={floor}>{floor}</option>
            ))}
            {floors.map((floor, index) => (
              <option key={`db-${index}`} value={floor}>{floor}</option>
            ))}
            <option value="Other">Other (Custom)</option>
          </select>
        </div>

        {showCustomFloor && (
          <div className="form-group">
            <label>Custom Floor *</label>
            <input
              type="text"
              name="customFloor"
              value={formData.customFloor}
              onChange={handleChange}
              placeholder="Enter custom floor"
              className="input-field"
              required
            />
          </div>
        )}

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
            onClick={() => navigate('/merchant/shops')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShop;

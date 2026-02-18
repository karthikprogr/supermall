import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';
import { validateRequired, validatePrice, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    features: '',
    shopId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, [currentUser]);

  const fetchShops = async () => {
    try {
      const shopsQuery = query(
        collection(db, 'shops'),
        where('ownerId', '==', currentUser.uid)
      );
      const shopsSnapshot = await getDocs(shopsQuery);
      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching shops:', error);
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
    if (!validateRequired(formData.name)) {
      setError('Product name is required');
      return;
    }

    if (!validatePrice(formData.price)) {
      setError('Valid price is required');
      return;
    }

    if (!validateRequired(formData.shopId)) {
      setError('Please select a shop');
      return;
    }

    setLoading(true);

    try {
      let imageURL = '';

      // Upload image if provided
      if (imageFile) {
        imageURL = await uploadImageToCloudinary(imageFile);
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageURL,
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      
      await logProduct.add(currentUser.uid, formData.name, docRef.id, formData.shopId);
      
      navigate('/merchant/products');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    }

    setLoading(false);
  };

  if (shops.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>No Shops Found</h2>
          <p>You need to create a shop before adding products.</p>
          <button onClick={() => navigate('/merchant/shops/create')} className="btn btn-primary">
            Create Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Add New Product</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="input-field"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Shop *</label>
          <select
            name="shopId"
            value={formData.shopId}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Select Shop</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.shopName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Features</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Enter product features (e.g., Color: Red, Size: Large)"
            className="textarea-field"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small>Max 5MB. Formats: JPG, PNG, GIF, WEBP</small>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/merchant/products')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logProduct } from '../../utils/logger';
import { validateRequired, validatePrice, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    features: '',
    shopId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState('');
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    fetchShopsAndProduct();
  }, [currentUser, productId]);

  const fetchShopsAndProduct = async () => {
    try {
      // Fetch shops
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

      // Fetch product
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const productData = productDoc.data();
        setFormData({
          name: productData.name,
          price: productData.price,
          features: productData.features || '',
          shopId: productData.shopId
        });
        setCurrentImageURL(productData.imageURL || '');
      } else {
        setError('Product not found');
      }
      setPageLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load product');
      setPageLoading(false);
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
      let imageURL = currentImageURL;

      // Upload image if provided
      if (imageFile) {
        imageURL = await uploadImageToCloudinary(imageFile);
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageURL,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'products', productId), productData);
      
      await logProduct.edit(currentUser.uid, formData.name, productId, formData.shopId);
      
      navigate('/merchant/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }

    setLoading(false);
  };

  if (pageLoading) {
    return <div className="loading">Loading product...</div>;
  }

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
      <h1>Edit Product</h1>
      
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
          {currentImageURL && (
            <div className="current-image">
              <img src={currentImageURL} alt={formData.name} />
              <p>Current image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small>Max 5MB. Formats: JPG, PNG, GIF, WEBP (Leave empty to keep current image)</small>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating Product...' : 'Update Product'}
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

export default EditProduct;

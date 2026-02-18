import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logOffer } from '../../utils/logger';
import { validateRequired, validateDiscount } from '../../utils/validation';

const CreateOffer = () => {
  const [formData, setFormData] = useState({
    productId: '',
    discount: '',
    validTill: '',
    description: ''
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('ownerId', '==', currentUser.uid)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateRequired(formData.productId)) {
      setError('Please select a product');
      return;
    }

    if (!validateDiscount(formData.discount)) {
      setError('Discount must be between 0 and 100');
      return;
    }

    if (!validateRequired(formData.validTill)) {
      setError('Validity date is required');
      return;
    }

    setLoading(true);

    try {
      const offerData = {
        ...formData,
        discount: parseFloat(formData.discount),
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'offers'), offerData);
      
      await logOffer.create(
        currentUser.uid, 
        `${formData.discount}% off`, 
        docRef.id
      );
      
      navigate('/merchant/offers');
    } catch (error) {
      console.error('Error creating offer:', error);
      setError('Failed to create offer');
    }

    setLoading(false);
  };

  if (products.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>No Products Found</h2>
          <p>You need to add products before creating offers.</p>
          <button onClick={() => navigate('/merchant/products/add')} className="btn btn-primary">
            Add Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Create New Offer</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Product *</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ₹{product.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Discount (%) *</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Enter discount percentage"
            className="input-field"
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Valid Till *</label>
          <input
            type="date"
            name="validTill"
            value={formData.validTill}
            onChange={handleChange}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter offer description"
            className="textarea-field"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating Offer...' : 'Create Offer'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/merchant')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOffer;

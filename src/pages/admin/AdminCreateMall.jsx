import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { validateRequired } from '../../utils/validation';

const AdminCreateMall = () => {
  const [formData, setFormData] = useState({
    mallName: '',
    location: '',
    description: '',
    maxMerchants: 10
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!validateRequired(formData.mallName)) {
      setError('Super Mall name is required');
      return;
    }

    if (!validateRequired(formData.location)) {
      setError('Location is required');
      return;
    }

    if (formData.maxMerchants < 1) {
      setError('Maximum merchants must be at least 1');
      return;
    }

    setLoading(true);

    try {
      // Create Super Mall
      await addDoc(collection(db, 'malls'), {
        mallName: formData.mallName,
        location: formData.location,
        description: formData.description,
        maxMerchants: parseInt(formData.maxMerchants),
        currentMerchants: 0,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });

      setSuccess('Super Mall created successfully!');
      
      // Reset form
      setFormData({
        mallName: '',
        location: '',
        description: '',
        maxMerchants: 10
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/malls');
      }, 2000);
    } catch (error) {
      console.error('Error creating mall:', error);
      setError(error.message || 'Failed to create super mall');
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1>Create Super Mall</h1>
      <p className="page-subtitle">Create a super mall structure. Add merchants separately after creation.</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h2>Super Mall Details</h2>
          
          <div className="form-group">
            <label htmlFor="mallName">Super Mall Name *</label>
            <input
              type="text"
              id="mallName"
              name="mallName"
              value={formData.mallName}
              onChange={handleChange}
              placeholder="e.g., Phoenix MarketCity, Forum Mall"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, Mumbai"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the super mall"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxMerchants">Maximum Merchants *</label>
            <input
              type="number"
              id="maxMerchants"
              name="maxMerchants"
              value={formData.maxMerchants}
              onChange={handleChange}
              min="1"
              required
            />
            <small>Maximum number of merchants (shop owners) allowed in this mall</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Super Mall'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/admin/malls')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateMall;


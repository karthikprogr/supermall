import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRequired } from '../../utils/validation';

const AdminEditMall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mallName: '',
    location: '',
    description: '',
    maxMerchants: 10
  });
  const [mall, setMall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMallDetails();
  }, [id]);

  const fetchMallDetails = async () => {
    try {
      const mallDoc = await getDoc(doc(db, 'malls', id));
      
      if (!mallDoc.exists()) {
        setError('Super Mall not found');
        setLoading(false);
        return;
      }

      const mallData = { id: mallDoc.id, ...mallDoc.data() };
      setMall(mallData);

      setFormData({
        mallName: mallData.mallName,
        location: mallData.location,
        description: mallData.description || '',
        maxMerchants: mallData.maxMerchants || 10
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching mall details:', error);
      setError('Failed to load mall details');
      setLoading(false);
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

    setSaving(true);

    try {
      // Update mall document
      await updateDoc(doc(db, 'malls', id), {
        mallName: formData.mallName,
        location: formData.location,
        description: formData.description,
        maxMerchants: parseInt(formData.maxMerchants),
        updatedAt: new Date().toISOString()
      });

      setSuccess('Mall details updated successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/malls');
      }, 2000);

    } catch (error) {
      console.error('Error updating mall:', error);
      setError(error.message || 'Failed to update super mall');
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="loading">Loading mall details...</div>;
  }

  if (error && !mall) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin/malls')} className="btn btn-secondary">
          Back to Malls
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Super Mall</h1>
        <button onClick={() => navigate('/admin/malls')} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        {/* Super Mall Details */}
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
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Super Mall'}
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

export default AdminEditMall;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AdminCreateMall = () => {
  const [formData, setFormData] = useState({ mallName: '', location: '', description: '', maxMerchants: 10 });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImageFile(file)) { setImageFile(file); setError(''); }
    else if(file) setError('Invalid image format (JPG/PNG < 5MB).');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateRequired(formData.mallName)) return setError('Mall name is required');
    if (!validateRequired(formData.location)) return setError('Location is required');

    setLoading(true);
    try {
      let imageURL = '';
      if (imageFile) imageURL = await uploadImageToCloudinary(imageFile);

      await addDoc(collection(db, 'malls'), {
        ...formData,
        imageURL,
        maxMerchants: parseInt(formData.maxMerchants),
        currentMerchants: 0,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });
      setSuccess('Super Mall initialized successfully!');
      setTimeout(() => navigate('/admin/malls'), 1500);
    } catch (error) { setError(error.message); }
    setLoading(false);
  };

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Initialize Infrastructure</h1>
        <p className="subtitle">Register a new high-performance super mall environment</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Infrastructure Identity *</label>
                <input type="text" name="mallName" value={formData.mallName} onChange={handleChange} placeholder="e.g., Global Plaza, Tech Atrium" className="input-field" required />
              </div>

              <div className="form-group full-width">
                <label>Geographic Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Downtown Core, Block B 5th Ave" className="input-field" required />
              </div>

              <div className="form-group full-width">
                <label>Architectural Narrative</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Architecture, focus area, or unique selling points..." className="input-field" rows="4" />
              </div>

              <div className="form-group">
                <label>Max Merchant Capacity *</label>
                <input type="number" name="maxMerchants" value={formData.maxMerchants} onChange={handleChange} className="input-field" min="1" required />
              </div>

              <div className="form-group">
                <label>Visual Identity Board</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                <small className="input-hint">Hero image for the mall frontend (Max 5MB).</small>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/admin/malls')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">{loading ? 'Initializing...' : 'Confirm Registration'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateMall;

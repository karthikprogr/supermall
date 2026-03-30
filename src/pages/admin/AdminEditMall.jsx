import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRequired, validateImageFile } from '../../utils/validation';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const AdminEditMall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mallName: '', location: '', description: '', maxMerchants: 10 });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchMallDetails(); }, [id]);

  const fetchMallDetails = async () => {
    try {
      const mallDoc = await getDoc(doc(db, 'malls', id));
      if (!mallDoc.exists()) throw new Error('Mall not found');
      const mallData = mallDoc.data();
      setFormData({ mallName: mallData.mallName, location: mallData.location, description: mallData.description || '', maxMerchants: mallData.maxMerchants || 10 });
      setCurrentImageURL(mallData.imageURL || '');
      setLoading(false);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImageFile(file)) { setImageFile(file); setError(''); }
    else if(file) setError('Invalid image format (JPG/PNG < 5MB).');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateRequired(formData.mallName)) return setError('Mall name required');
    if (!validateRequired(formData.location)) return setError('Location required');

    setSaving(true);
    try {
      let imageURL = currentImageURL;
      if (imageFile) imageURL = await uploadImageToCloudinary(imageFile);

      await updateDoc(doc(db, 'malls', id), { ...formData, imageURL, maxMerchants: parseInt(formData.maxMerchants), updatedAt: new Date().toISOString() });
      setSuccess('Infrastructure shell updated successfully!');
      setTimeout(() => navigate('/admin/malls'), 1500);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  if (loading) return <div className="loading">Retrieving shell metadata...</div>;

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Modify Infrastructure</h1>
        <p className="subtitle">Update the architectural parameters for this environment</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card">
          <form onSubmit={handleSubmit} className="premium-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Infrastructure Identity *</label>
                <input type="text" name="mallName" value={formData.mallName} onChange={handleChange} required />
              </div>
              <div className="form-group full-width">
                <label>Geographic Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group full-width">
                <label>Contextual Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
              </div>
              
              <div className="form-group">
                <label>Max Merchant Capacity *</label>
                <input type="number" name="maxMerchants" value={formData.maxMerchants} onChange={handleChange} min="1" required />
              </div>

              <div className="form-group">
                <label>Current Visual Board</label>
                {currentImageURL ? (
                  <div style={{width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginBottom: '1.5rem'}}>
                    <img src={currentImageURL} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                ) : <p style={{color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>No visual assets associated with this shell.</p>}
                
                <label>Update Identity Asset</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                <small className="input-hint">Leave blank to retain current visual metadata.</small>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" onClick={() => navigate('/admin/malls')} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-large">{saving ? 'Syncing...' : 'Save Revisions'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMall;

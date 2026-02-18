import { useState } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onSelectRole, userName }) => {
  const [selectedRole, setSelectedRole] = useState('user');

  const handleSubmit = () => {
    onSelectRole(selectedRole);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome, {userName}!</h2>
        <p>Please select your role:</p>
        
        <div className="role-selection">
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="user"
              checked={selectedRole === 'user'}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <div className="role-card">
              <h3>👤 Customer</h3>
              <p>Browse shops, products and special offers</p>
            </div>
          </label>

          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="merchant"
              checked={selectedRole === 'merchant'}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <div className="role-card">
              <h3>🏪 Merchant</h3>
              <p>Manage your shops, products and offers</p>
            </div>
          </label>

          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={selectedRole === 'admin'}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <div className="role-card">
              <h3>⚙️ Admin</h3>
              <p>Manage entire mall, categories and floors</p>
            </div>
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn btn-primary">
            Continue as {selectedRole === 'user' ? 'Customer' : selectedRole === 'merchant' ? 'Merchant' : 'Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;

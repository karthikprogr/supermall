import { useAuth } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const { userName, logout } = useAuth();
  const { selectedMall, clearMallSelection } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleChangeMall = () => {
    clearMallSelection();
    navigate('/user/malls');
  };

  return (
    <div className="page-container">
      <div className="account-header">
        <div className="account-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2>{userName}</h2>
        <p className="account-role">Customer Account</p>
      </div>

      <div className="account-section">
        <h3>Current Shopping Location</h3>
        <div className="account-info-card">
          <div className="info-row">
            <span className="info-label">Super Mall:</span>
            <span className="info-value">{selectedMall?.name || 'Not Selected'}</span>
          </div>
          {selectedMall?.location && (
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">{selectedMall.location}</span>
            </div>
          )}
          <button onClick={handleChangeMall} className="btn btn-primary">
            Change Mall
          </button>
        </div>
      </div>

      <div className="account-section">
        <h3>Account Actions</h3>
        <div className="account-actions">
          <button className="action-btn" onClick={() => navigate('/user/saved-items')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Saved Items</span>
          </button>

          <button className="action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Order History</span>
          </button>

          <button className="action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Privacy Settings</span>
          </button>

          <button className="action-btn" onClick={() => navigate('/user/help-support')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Help & Support</span>
          </button>

          <button onClick={handleLogout} className="action-btn logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;

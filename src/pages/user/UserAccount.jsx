import { useAuth } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const { userName, logout } = useAuth();
  const { selectedMall, clearMallSelection } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) navigate('/login');
  };

  const handleChangeMall = () => {
    clearMallSelection();
    navigate('/user/malls');
  };

  return (
    <div className="admin-page container section-padding">
      <div className="page-header text-center">
        <h1 className="primary-gradient-text">Shopper Profile</h1>
        <p className="subtitle">Manage your verified shopping parameters and operational security</p>
      </div>

      <div className="form-card-wrapper">
        <div className="form-glass-card glass-card" style={{padding: '3rem'}}>
          <div className="account-profile-header" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem'}}>
            <div className="auth-icon" style={{margin: '0 0 1.5rem 0'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#fff">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{userName}</h2>
            <p style={{color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em'}}>Certified Consumer Profile</p>
          </div>

          <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2rem', marginBottom: '3rem'}}>
            <h4 style={{fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem'}}>Active Shopping Node</h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem'}}>
                <div>
                   <p style={{fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '0.25rem'}}>PRIMARY HUB</p>
                   <p style={{fontSize: '1.1rem', fontWeight: 600}}>{selectedMall?.mallName || 'No Mall Selected'}</p>
                </div>
                <div>
                   <p style={{fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '0.25rem'}}>GEOGRAPHIC TAG</p>
                   <p style={{fontSize: '1.1rem', fontWeight: 600}}>{selectedMall?.location || 'Unmapped'}</p>
                </div>
            </div>
            <button onClick={handleChangeMall} className="btn btn-secondary btn-sm" style={{width: '100%', marginTop: '2rem', justifyContent: 'center'}}>Change Market Node</button>
          </div>

          <div className="account-action-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
             <button onClick={() => navigate('/user/saved-items')} className="btn btn-outline btn-block" style={{padding: '1.25rem', justifyContent: 'flex-start', fontSize: '0.9rem'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '1rem', color: 'var(--primary)'}}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Saved Items
             </button>
             <button className="btn btn-outline btn-block" style={{padding: '1.25rem', justifyContent: 'flex-start', fontSize: '0.9rem', opacity: 0.6}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '1rem'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Order History
             </button>
             <button className="btn btn-outline btn-block" style={{padding: '1.25rem', justifyContent: 'flex-start', fontSize: '0.9rem', opacity: 0.6}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '1rem'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Privacy
             </button>
             <button onClick={() => navigate('/user/help-support')} className="btn btn-outline btn-block" style={{padding: '1.25rem', justifyContent: 'flex-start', fontSize: '0.9rem'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '1rem', color: 'var(--secondary)'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Support
             </button>
          </div>

          <hr style={{margin: '3rem 0', borderColor: 'var(--glass-border)'}} />
          
          <button onClick={handleLogout} className="btn btn-danger btn-block" style={{padding: '1.25rem', justifyContent: 'center'}}>
             Secure Logout Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;

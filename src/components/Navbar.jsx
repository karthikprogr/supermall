import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false); };
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) navigate('/login');
    setShowUserMenu(false);
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'merchant') return '/merchant';
    return '/user';
  };

  const navTo = (path) => { navigate(path); setShowUserMenu(false); };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Super Mall</Link>
        
        <div className="nav-menu">
          {currentUser ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              
              {/* ADMIN ARCHITECTURE LINKS */}
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/malls" className="nav-link">Super Malls</Link>
                  <Link to="/admin/categories" className="nav-link">Categories</Link>
                  <Link to="/admin/shops" className="nav-link">Shops</Link>
                  <Link to="/admin/merchants" className="nav-link">Merchants</Link>
                </>
              )}

              {/* MERCHANT ARCHITECTURE LINKS */}
              {userRole === 'merchant' && (
                <>
                  <Link to="/merchant/shops" className="nav-link">My Shops</Link>
                  <Link to="/merchant/products" className="nav-link">Inventory</Link>
                </>
              )}

              {/* USER / SHOPPER LINKS */}
              {userRole === 'user' && (
                <>
                  <Link to="/user/shops" className="nav-link">Browse Shops</Link>
                  <Link to="/user/products" className="nav-link">Products</Link>
                </>
              )}
              
              <div className="nav-user">
                {userRole === 'user' ? (
                  <div className="user-menu-container" ref={userMenuRef}>
                    <div className="user-name" onClick={() => setShowUserMenu(!showUserMenu)}>
                      <span>{userName}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{marginTop: '2px', opacity: 0.6}}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>

                    {showUserMenu && (
                      <div className="user-dropdown-menu">
                        <div style={{padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8}}>User Protocol</div>
                        <hr style={{margin: '0.25rem 0 0.5rem', borderColor: 'rgba(255, 255, 255, 0.04)'}} />
                        <button onClick={() => navTo('/user/account')} className="dropdown-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          My Account
                        </button>
                        <button onClick={() => navTo('/user/saved-items')} className="dropdown-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                          Saved Items
                        </button>
                        <button onClick={() => navTo('/user/help-support')} className="dropdown-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                          Help & Support
                        </button>
                        <hr style={{margin: '0.5rem 0', borderColor: 'rgba(255, 255, 255, 0.04)', borderStyle: 'dashed'}} />
                        <button onClick={handleLogout} className="dropdown-item logout-item" style={{marginTop: '0.25rem'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                       <span className="user-name" style={{cursor: 'default'}}>{userName}</span>
                       <span style={{background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', padding: '0.35rem 0.75rem', borderRadius: '6px', letterSpacing: '0.1em'}}>{userRole}</span>
                    </div>
                    <button onClick={handleLogout} style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.3s'}} onMouseOver={(e) => e.currentTarget.style.background='var(--danger)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link" style={{background: 'var(--primary)', padding: '0.6rem 1.5rem', borderRadius: '99px', color: '#fff'}}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

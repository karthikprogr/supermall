import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleAccountClick = () => {
    navigate('/user/account');
    setShowUserMenu(false);
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'merchant') return '/merchant';
    if (userRole === 'user') return '/user';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Super Mall
        </Link>
        
        <div className="nav-menu">
          {currentUser ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">
                Dashboard
              </Link>
              {userRole === 'user' && (
                <>
                  <Link to="/user/shops" className="nav-link">
                    Browse Shops
                  </Link>
                  <Link to="/user/products" className="nav-link">
                    Products
                  </Link>
                </>
              )}
              {userRole === 'merchant' && (
                <>
                  <Link to="/merchant/shops" className="nav-link">
                    My Shops
                  </Link>
                  <Link to="/merchant/products" className="nav-link">
                    Products
                  </Link>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/malls" className="nav-link">
                    Super Malls
                  </Link>
                  <Link to="/admin/categories" className="nav-link">
                    Categories
                  </Link>
                  <Link to="/admin/merchants" className="nav-link">
                    Merchants
                  </Link>
                </>
              )}
              <div className="nav-user">
                <div className="user-menu-container" ref={userMenuRef}>
                  <span 
                    className="user-name" 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{cursor: 'pointer'}}
                  >
                    {userName}
                  </span>
                  {showUserMenu && userRole === 'user' && (
                    <div className="user-dropdown-menu">
                      <button onClick={handleAccountClick} className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        My Account
                      </button>
                      <button onClick={() => {navigate('/user/saved-items'); setShowUserMenu(false);}} className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        Saved Items
                      </button>
                      <button onClick={() => {navigate('/user/help-support'); setShowUserMenu(false);}} className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="16" x2="12" y2="12"/>
                          <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        Help & Support
                      </button>
                      <hr style={{margin: '0.5rem 0', borderColor: 'rgba(255, 255, 255, 0.1)'}} />
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {(userRole === 'admin' || userRole === 'merchant') && (
                  <span className="user-role-badge">{userRole}</span>
                )}
                {userRole !== 'user' && (
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

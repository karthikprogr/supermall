import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileBottomNav = () => {
  const { userRole } = useAuth();
  const location = useLocation();

  if (userRole !== 'user') return null;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/user/malls" className={`bottom-nav-item ${isActive('/user/malls') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Home</span>
      </Link>

      <Link to="/user/shops" className={`bottom-nav-item ${isActive('/user/shops') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <span>Shops</span>
      </Link>

      <Link to="/user/products" className={`bottom-nav-item ${isActive('/user/products') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13"/>
          <path d="M16 8h5l-1.5 9H16"/>
        </svg>
        <span>Products</span>
      </Link>

      <Link to="/user/offers" className={`bottom-nav-item ${isActive('/user/offers') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        <span>Offers</span>
      </Link>

      <Link to="/user/account" className={`bottom-nav-item ${isActive('/user/account') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;

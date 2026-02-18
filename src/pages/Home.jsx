import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser, userRole } = useAuth();

  // Redirect logged-in users to their respective dashboards
  if (currentUser && userRole === 'user') {
    return <Navigate to="/user/malls" replace />;
  }
  
  if (currentUser && userRole === 'merchant') {
    return <Navigate to="/merchant" replace />;
  }
  
  if (currentUser && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Welcome to Super Mall
        </h1>
        <p className="hero-subtitle">
          Your Digital Shopping Destination - Connect Merchants & Customers
        </p>
        
        <div className="hero-content">
          <div className="hero-features">
            <div className="feature-card">
              <h3>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                For Merchants
              </h3>
              <p>Create your shop, manage products, and reach customers globally</p>
            </div>
            <div className="feature-card">
              <h3>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                For Shoppers
              </h3>
              <p>Browse shops, compare products, and discover amazing offers</p>
            </div>
            <div className="feature-card">
              <h3>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m0-18a11 11 0 0 1 0 22m0-22a11 11 0 0 0 0 22m0-22V7m0 10v5m4.22-18.78l4.24 4.24m-16.92 0l4.24-4.24m0 16.92l-4.24 4.24m16.92 0l-4.24-4.24"/>
                </svg>
                For Admins
              </h3>
              <p>Manage categories, floors, and oversee the entire mall system</p>
            </div>
          </div>

          {!currentUser ? (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-large">
                Get Started - Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Create Account
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link 
                to={userRole === 'admin' ? '/admin' : userRole === 'merchant' ? '/merchant' : '/user'} 
                className="btn btn-primary btn-large"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <h2>Problem Statement</h2>
        <p>
          Small and rural merchants struggle to showcase their products digitally and reach 
          customers globally. There is no centralized platform to manage multiple shops, 
          offers, categories, and locations in a single mall-style system.
        </p>
        
        <h2>Our Solution</h2>
        <p>
          Super Mall Web Application enables merchants to manage shop details and products, 
          while allowing users to browse, filter, compare, and discover offers efficiently 
          in a secure, scalable web platform.
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </h3>
            <p>Multiple Shops</p>
          </div>
          <div className="stat-card">
            <h3>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </h3>
            <p>Product Management</p>
          </div>
          <div className="stat-card">
            <h3>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </h3>
            <p>Offer System</p>
          </div>
          <div className="stat-card">
            <h3>🔍</h3>
            <p>Advanced Filters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

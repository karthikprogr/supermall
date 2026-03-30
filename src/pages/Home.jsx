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
        <div className="hero-banner">
          <img src="/images/super_mall_hero.png" alt="Super Mall Hero" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content-main">
          <h1 className="hero-title">
            Experience the Future of Digital Shopping
          </h1>
          <p className="hero-subtitle">
            The ultimate Multi-Vendor Marketplace connecting premium merchants with discerning customers.
          </p>
          
          {!currentUser ? (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-large">
                Get Started - Login
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-large">
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

      <div className="container section-padding">
        <div className="features-section">
          <h2 className="section-title primary-gradient-text">Designed for Everyone</h2>
          <div className="hero-features">
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <img src="/images/merchant_feature_icon.png" alt="Merchant Feature" className="feature-icon" />
              </div>
              <h3>For Merchants</h3>
              <p>Create your custom digital storefront, manage inventory with ease, and reach a global audience through our optimized platform.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <img src="/images/shopper_feature_icon.png" alt="Shopper Feature" className="feature-icon" />
              </div>
              <h3>For Shoppers</h3>
              <p>Discover personalized collections, compare premium products, and unlock exclusive rewards with our seamless shopping experience.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <img src="/images/admin_feature_icon.png" alt="Admin Feature" className="feature-icon" />
              </div>
              <h3>For Mall Admins</h3>
              <p>Scale your operations effortlessly. Oversee multiple merchants, floors, and categories with our powerful administrative suite.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="info-section">
          <div className="info-content-grid glass-card" style={{padding: '4rem'}}>
            <div className="info-text">
              <h2 className="primary-gradient-text">Redefining Small Business Growth</h2>
              <p>
                In today's digital era, small and rural merchants often face barriers in showcasing their craftsmanship to a broader audience. <strong>Super Mall</strong> bridges this gap by providing a centralized, high-performance ecosystem.
              </p>
              <p>
                Our solution empowers creators with professional tools to manage products, offers, and locations—all within a single, secure, and visually stunning digital mall architecture.
              </p>
            </div>
            <div className="info-visual">
              <img src="/images/super_mall_hero.png" alt="Digital Mall" className="hero-image" style={{opacity: 1, borderRadius: '2rem'}} />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card glass-card">
              <h3 className="stat-number">100+</h3>
              <p>Premium Shops</p>
            </div>
            <div className="stat-card glass-card">
              <h3 className="stat-number">50K+</h3>
              <p>Unique Products</p>
            </div>
            <div className="stat-card glass-card">
              <h3 className="stat-number">24/7</h3>
              <p>Expert Support</p>
            </div>
            <div className="stat-card glass-card">
              <h3 className="stat-number">⚡</h3>
              <p>Flash Offers</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;


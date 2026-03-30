import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-branding">
            <Link to="/" className="nav-logo">Super Mall</Link>
            <p className="footer-motto">Experience the future of premium multi-vendor shopping. Connecting merchants and shoppers with high-performance digital tools.</p>
            <div className="social-links">
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">Instagram</a>
            </div>
          </div>

          <div className="footer-links-column">
            <h4>Quick Links</h4>
            <Link to="/user/malls">Explore Malls</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="footer-links-column">
            <h4>Support</h4>
            <Link to="/help-center">Help Center</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className="footer-links-column">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive flash offers and updates.</p>
            <div className="newsletter-input">
              <input type="text" placeholder="your@email.com" />
              <button className="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Super Mall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

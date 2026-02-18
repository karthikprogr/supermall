import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import RoleSelectionModal from '../components/RoleSelectionModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, signInWithGoogle, currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'merchant') navigate('/merchant');
      else if (userRole === 'user') navigate('/user');
    }
  }, [currentUser, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Failed to login');
      setLoading(false);
      return;
    }
    // Navigation will be handled by useEffect when userRole is updated

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    const result = await signInWithGoogle();
    
    if (result.success) {
      if (result.needsRole) {
        // Show role selection for new users
        setPendingGoogleUser(result.user);
        setShowRoleModal(true);
        setLoading(false);
      } else {
        // Existing user - navigation will be handled by useEffect
        // when userRole is updated. Keep loading true until redirect
      }
    } else {
      setError(result.error || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role) => {
    setLoading(true);
    // Complete registration with selected role
    const result = await signInWithGoogle(role);
    setShowRoleModal(false);
    
    if (result.success) {
      // Navigation will be handled by useEffect when userRole is updated
    } else {
      setError('Failed to complete registration');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!validateEmail(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Password reset email sent! Check your inbox.');
      setResetEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setResetError('No account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        setResetError('Invalid email address');
      } else {
        setResetError('Failed to send reset email. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue shopping</p>
      </div>

      <div className="auth-container">
        {error && <div className="error-message">{error}</div>}
        
        {!showForgotPassword ? (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M22,6L12,13L2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    style={{ paddingRight: '3rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="forgot-password-link">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="link-button"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <button 
              onClick={handleGoogleSignIn} 
              disabled={loading} 
              className="btn btn-google btn-block"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="auth-link">
              Don't have an account? <Link to="/register">Sign up for free</Link>
            </p>
          </>
        ) : (
          <div className="forgot-password-form">
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            
            {resetError && <div className="error-message">{resetError}</div>}
            {resetSuccess && (
              <div className="success-message">
                {resetSuccess}
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  ⚠️ <strong>Note:</strong> If you don't see the email in your inbox, please check your <strong>spam/junk folder</strong>.
                </p>
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
                <small style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  📧 Check your spam/junk folder if you don't receive the email
                </small>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetError('');
                  setResetSuccess('');
                }}
                className="btn btn-secondary btn-block"
                style={{ marginTop: '10px' }}
              >
                Back to Login
              </button>
            </form>
          </div>
        )}

        <RoleSelectionModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onSelectRole={handleRoleSelection}
          userName={pendingGoogleUser?.displayName || 'User'}
        />
      </div>

      <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <p><strong>Admin:</strong> seelamkarthik2006@gmail.com / admin123</p>
        <p><strong>Merchant:</strong> zudio2@gmail.com / zudio21</p>
        <p><strong>User:</strong> user@supermall.com / user123</p>
      </div>
    </div>
  );
};

export default Login;

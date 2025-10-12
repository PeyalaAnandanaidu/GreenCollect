import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaRecycle, FaLeaf, FaUsers } from 'react-icons/fa';
import './Login.css';

interface LoginProps {
  onLogin: (role: 'user' | 'collector' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login - in real app, this would be an API call
    let role: 'user' | 'collector' | 'admin' = 'user';
    
    // Simple role detection based on email (for demo purposes)
    if (email.includes('collector')) role = 'collector';
    if (email.includes('admin')) role = 'admin';
    
    // Call the onLogin prop passed from App.tsx
    onLogin(role);
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-content">
        {/* Left Side - Brand Section */}
        <div className="login-brand-section">
          <div className="brand-container">
            <div className="brand-icon">
              <FaRecycle className="icon" />
            </div>
            <h1 className="brand-title">Janatha Garage</h1>
            <p className="brand-tagline">the people workshop for sustainable tomorrow</p>
            <p className="brand-subtitle">
              Transforming waste into resources, building a cleaner future together
            </p>
            <div className="brand-features">
              <div className="feature">
                <FaRecycle className="feature-icon" />
                <span>Smart Waste Collection</span>
              </div>
              <div className="feature">
                <FaLeaf className="feature-icon" />
                <span>Eco-Rewards System</span>
              </div>
              <div className="feature">
                <FaUsers className="feature-icon" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your Janatha Garage account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FaLock className="input-icon" />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input password-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-button">
                <span>Sign In to Janatha Garage</span>
                <FaArrowRight className="button-icon" />
              </button>
            </form>

            <div className="demo-credentials">
              <h4>Demo Credentials:</h4>
              <div className="credential-list">
                <div className="credential">
                  <strong>User:</strong> user@example.com / any password
                </div>
                <div className="credential">
                  <strong>Collector:</strong> collector@example.com / any password
                </div>
                <div className="credential">
                  <strong>Admin:</strong> admin@example.com / any password
                </div>
              </div>
            </div>

            <div className="login-divider">
              <span>New to Janatha Garage?</span>
            </div>

            <div className="signup-link">
              Join our mission for sustainable tomorrow 
              <Link to="/register" className="signup-text">
                Create Account
              </Link>
            </div>

            <div className="community-stats">
              <div className="stat">
                <strong>1,000+</strong>
                <span>Community Members</span>
              </div>
              <div className="stat">
                <strong>5,000+</strong>
                <span>Kg Waste Recycled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaRecycle, FaLeaf, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      console.log('Attempting login...', { email });
      
      const res = await axios.post('http://localhost:4000/api/auth/login', { 
        email, 
        password 
      });
      
      console.log('Login response:', res.data);
      
      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Use the auth context to login
      login(user, token, rememberMe);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Login error details:', err);
      
      if (err.response) {
        setErrorMessage(err.response.data?.error || `Login failed: ${err.response.status}`);
      } else if (err.request) {
        setErrorMessage('Cannot connect to server. Please check your connection.');
      } else {
        setErrorMessage(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-content">
        <div className="login-brand-section">
          <div className="brand-container">
            <div className="brand-icon"><FaRecycle className="icon" /></div>
            <h1 className="brand-title">Janatha Garage</h1>
            <p className="brand-tagline">the people workshop for sustainable tomorrow</p>
            <p className="brand-subtitle">
              Transforming waste into resources, building a cleaner future together
            </p>
            <div className="brand-features">
              <div className="feature"><FaRecycle className="feature-icon" /><span>Smart Waste Collection</span></div>
              <div className="feature"><FaLeaf className="feature-icon" /><span>Eco-Rewards System</span></div>
              <div className="feature"><FaUsers className="feature-icon" /><span>Community Driven</span></div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your Janatha Garage account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="input-icon" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FaLock className="input-icon" /> Password
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
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={togglePasswordVisibility}
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {errorMessage && (
                <div className="error-message">
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                <span>
                  {loading ? 'Signing In...' : 'Sign In to Janatha Garage'}
                </span>
                {!loading && <FaArrowRight className="button-icon" />}
              </button>
            </form>

            <div className="login-divider">
              <span>New to Janatha Garage?</span>
            </div>
            <div className="signup-link">
              Join our mission for sustainable tomorrow 
              <Link to="/register" className="signup-text">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
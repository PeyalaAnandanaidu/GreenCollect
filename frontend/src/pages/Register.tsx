import './Register.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaTruck, FaIdCard, FaClipboard, FaCheck, FaArrowRight, FaRecycle, FaUsers } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role

  // Collector specific fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [experience, setExperience] = useState('');

  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let payload: any = { name, email, password, role };

      if (role === 'collector') {
        payload.collectorInfo = {
          phone,
          address,
          vehicleType,
          vehicleNumberPlate: vehicleNumber,
          experience
        };
      }

      const res = await axios.post('https://greencollect.onrender.com/api/auth/register', payload);

      if (res.status === 201) {
        if (role === 'collector') {
          alert(`Collector Registration Submitted!\n\nYour application will be reviewed by admin.`);
        } else {
          alert(`User Registration Successful!\n\nWelcome ${name}! You can now login.`);
        }
        console.log('Registration response:', res.data);
      }
    } catch (err: any) {
      console.error('Registration error:', err.response || err);
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  const isCollector = role === 'collector';

  return (
    <div className="register-container">
      {/* Background Animation */}
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="register-content">
        {/* Left Side - Brand Section */}
        <div className="register-brand-section">
          <div className="brand-container">
            <div className="brand-icon">
              <FaRecycle className="icon" />
            </div>
            <h1 className="brand-title">Janatha Garage</h1>
            <p className="brand-tagline">the people workshop for sustainable tomorrow</p>
            <p className="brand-subtitle">
              Join our community and be part of the sustainable revolution
            </p>
            <div className="brand-features">
              <div className="feature">
                <FaRecycle className="feature-icon" />
                <span>Smart Waste Management</span>
              </div>
              <div className="feature">
                <FaUsers className="feature-icon" />
                <span>Community Driven</span>
              </div>
              <div className="feature">
                <FaCheck className="feature-icon" />
                <span>Instant Rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-section">
          <div className="register-form-container">
            <div className="form-header">
              <h2>Join Janatha Garage</h2>
              <p>Create your account and start your sustainable journey</p>
            </div>

            <form onSubmit={handleRegister} className="register-form">
              {/* Basic Information for all users */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUser className="section-icon" />
                  Basic Information
                </h3>
                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="input-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaLock className="input-icon" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUsers className="section-icon" />
                  Choose Your Role
                </h3>
                <div className="role-selection">
                  <div className={`role-option ${role === 'user' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      id="user-role"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={e => setRole(e.target.value)}
                      className="role-radio"
                    />
                    <label htmlFor="user-role" className="role-label">
                      <div className="role-icon">
                        <FaUser />
                      </div>
                      <div className="role-info">
                        <strong>Community Member</strong>
                        <span>Schedule pickups & earn eco-rewards</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={`role-option ${role === 'collector' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      id="collector-role"
                      name="role"
                      value="collector"
                      checked={role === 'collector'}
                      onChange={e => setRole(e.target.value)}
                      className="role-radio"
                    />
                    <label htmlFor="collector-role" className="role-label">
                      <div className="role-icon">
                        <FaTruck />
                      </div>
                      <div className="role-info">
                        <strong>Eco Collector</strong>
                        <span>Collect waste & serve the community</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Collector Specific Fields */}
              {isCollector && (
                <div className="form-section collector-fields">
                  <h3 className="section-title">
                    <FaIdCard className="section-icon" />
                    Collector Details
                  </h3>
                  <p className="section-subtitle">
                    Help us serve the community better. Your application will be reviewed by our team.
                  </p>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaPhone className="input-icon" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="form-input"
                      placeholder="Enter your phone number"
                      required={isCollector}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaMapMarkerAlt className="input-icon" />
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="form-input"
                      placeholder="Enter your complete address"
                      rows={3}
                      required={isCollector}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <FaTruck className="input-icon" />
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        className="form-input"
                        required={isCollector}
                      >
                        <option value="">Select Vehicle Type</option>
                        <option value="Three-wheeler">Three-wheeler</option>
                        <option value="Pickup Truck">Pickup Truck</option>
                        <option value="Mini Truck">Mini Truck</option>
                        <option value="Truck">Truck</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <FaIdCard className="input-icon" />
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={e => setVehicleNumber(e.target.value)}
                        className="form-input"
                        placeholder="e.g., KA01AB1234"
                        required={isCollector}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaClipboard className="input-icon" />
                      Experience
                    </label>
                    <textarea
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="form-input"
                      placeholder="Tell us about your experience"
                      rows={3}
                      required={isCollector}
                    />
                  </div>

                  <div className="collector-notice">
                    <div className="notice-icon">⏳</div>
                    <div className="notice-content">
                      <strong>Verification Required</strong>
                      <p>Your collector profile will be activated within 24-48 hours after verification. You'll receive an email confirmation.</p>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="register-button">
                <span>
                  {isCollector ? 'Submit Application' : 'Join Janatha Garage'}
                </span>
                <FaArrowRight className="button-icon" />
              </button>
            </form>

            {message && <p className="error-message">{message}</p>}

            <div className="login-link">
              Already part of our community? 
              <Link to="/login" className="login-text">
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

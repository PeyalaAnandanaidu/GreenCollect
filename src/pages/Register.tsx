import './Register.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'collector') {
      // Collector registration data
      const collectorData = {
        name,
        email,
        password,
        role,
        phone,
        address,
        vehicleType,
        vehicleNumber,
        experience,
        status: 'pending' // Collector requests need admin approval
      };
      alert(`Collector Registration Submitted!\n\nWe've received your application. Please wait for admin approval.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nVehicle: ${vehicleType} (${vehicleNumber})`);
      console.log('Collector Registration:', collectorData);
    } else {
      // User registration data
      const userData = {
        name,
        email,
        password,
        role
      };
      alert(`User Registration Successful!\n\nWelcome ${name}! You can now login and start using our services.`);
      console.log('User Registration:', userData);
    }
    
    // TODO: Connect to backend API
  };

  const isCollector = role === 'collector';

  return (
    <div className="register-page">
      <div className="register-card shadow">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleRegister}>
          {/* Basic Information for all users */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="mb-3">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="form-label">I want to register as:</label>
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
                  <div className="role-icon">👤</div>
                  <div className="role-info">
                    <strong>Regular User</strong>
                    <span>Schedule pickups & earn rewards</span>
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
                  <div className="role-icon">🚛</div>
                  <div className="role-info">
                    <strong>Waste Collector</strong>
                    <span>Collect waste & earn money</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Collector Specific Fields */}
          {isCollector && (
            <div className="form-section collector-fields">
              <h3 className="section-title">Collector Information</h3>
              <p className="section-subtitle">
                Please provide your details. Your application will be reviewed by our admin team.
              </p>
              
              <div className="mb-3">
                <label className="form-label">Phone Number:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="form-control"
                  placeholder="Enter your phone number"
                  required={isCollector}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Address:</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="Enter your complete address"
                  rows={3}
                  required={isCollector}
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Vehicle Type:</label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                    className="form-select"
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Vehicle Number:</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value)}
                    className="form-control"
                    placeholder="e.g., KA01AB1234"
                    required={isCollector}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Experience:</label>
                <textarea
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="form-control"
                  placeholder="Tell us about your experience in waste collection or related field"
                  rows={3}
                  required={isCollector}
                />
              </div>

              <div className="collector-notice">
                <div className="notice-icon">⏳</div>
                <div className="notice-content">
                  <strong>Approval Required</strong>
                  <p>Your collector account will be activated after admin approval. You'll receive an email once approved.</p>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 mt-3 register-btn">
            {isCollector ? 'Submit Application' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
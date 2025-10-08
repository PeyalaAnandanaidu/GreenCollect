import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login with Email: ${email} Password: ${password}`);
    // TODO: Connect to backend API
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-card p-5 shadow rounded">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2">Login</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register" className="text-success">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

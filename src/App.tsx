import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import StatusPage from './pages/StatusPage';
import RedeemCheckout from './pages/RedeemCheckout';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState<'user' | 'collector' | 'admin'>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu when tab changes
  };

  const handleLogin = (role: 'user' | 'collector' | 'admin') => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setActiveTab('overview');
    setMenuOpen(false);
  };

  return (
    <Router>
      <Navbar
        onMenuToggle={handleMenuToggle}
        menuOpen={menuOpen}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        role={userRole}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <div className="main-content-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                role={userRole}
                onLogout={handleLogout}
                activeTab={activeTab}
              />
            }
          />
          <Route
            path="/status"
            element={
              <StatusPage
                onTabChange={handleTabChange}
                activeTab={activeTab}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                onTabChange={handleTabChange}
                activeTab={activeTab}
                role={userRole}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/redeem" element={<RedeemCheckout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
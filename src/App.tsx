import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ElevenLabsEmbed from './components/ElevenLabsEmbed';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import StatusPage from './pages/StatusPage';
import RedeemCheckout from './pages/RedeemCheckout';
import OrderSuccess from './pages/OrderSuccess';

// Create a wrapper component that uses the auth context
function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth(); // Get user and logout from auth context

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu when tab changes
  };

  const handleLoginSuccess = () => {
    setActiveTab('overview');
  };

  const handleLogout = () => {
    logout(); // Use the logout from auth context
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
        role={user?.role || 'user'} // Use role from auth context
        onLogout={handleLogout}
        isLoggedIn={!!user} // Use user existence for login status
      />
      <div className="main-content-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                role={user?.role || 'user'}
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
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                onTabChange={handleTabChange}
              />
            }
          />
          <Route path="/redeem" element={<RedeemCheckout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
      <Footer />
  {/* ElevenLabs ConvAI widget (single integration) */}
  <ElevenLabsEmbed isLoggedIn={!!user} />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
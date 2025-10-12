import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StatusPage from './pages/StatusPage';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState<'user' | 'collector' | 'admin'>('user');
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu when tab changes
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
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
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

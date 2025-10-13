import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'collector' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already logged in)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-specific protected routes
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>
);

const CollectorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="collector">{children}</ProtectedRoute>
);

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

// Unauthorized Page Component
const UnauthorizedPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Your current role: <strong>{user?.role}</strong></p>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-primary"
        >
          Go Back
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          className="btn btn-secondary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// Create a wrapper component that uses the auth context
function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout, loading } = useAuth();

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
    logout();
    setActiveTab('overview');
    setMenuOpen(false);
  };

  // Show loading screen while authentication is being checked
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner-large"></div>
        <h2>Janatha Garage</h2>
        <p>Loading your experience...</p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar
        onMenuToggle={handleMenuToggle}
        menuOpen={menuOpen}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        role={user?.role || 'user'}
        onLogout={handleLogout}
        isLoggedIn={!!user}
      />
      <div className="main-content-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login onLogin={handleLoginSuccess} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Accessible to all authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard
                  role={user?.role || 'user'}
                  onLogout={handleLogout}
                  activeTab={activeTab}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile
                  onTabChange={handleTabChange}
                  activeTab={activeTab}
                  role={user?.role || 'user'}
                  onLogout={handleLogout}
                  user={user}
                />
              </ProtectedRoute>
            } 
          />

          {/* User-only Routes */}
          <Route 
            path="/status" 
            element={
              <UserRoute>
                <StatusPage
                  onTabChange={handleTabChange}
                  activeTab={activeTab}
                />
              </UserRoute>
            } 
          />
          <Route 
            path="/redeem" 
            element={
              <UserRoute>
                <RedeemCheckout />
              </UserRoute>
            } 
          />
          <Route 
            path="/order-success" 
            element={
              <UserRoute>
                <OrderSuccess />
              </UserRoute>
            } 
          />

          {/* Collector-only Routes */}
          {/* Add collector-specific routes here when needed */}
          {/* <Route 
            path="/collector-dashboard" 
            element={
              <CollectorRoute>
                <CollectorDashboard />
              </CollectorRoute>
            } 
          /> */}

          {/* Admin-only Routes */}
          {/* Add admin-specific routes here when needed */}
          {/* <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          /> */}

          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
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
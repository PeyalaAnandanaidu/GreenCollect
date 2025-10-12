import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FaUserCircle,
  FaBell,
  FaCoins,
  FaBars,
  FaTimes,
  FaChartLine,
  FaCalendar,
  FaListAlt,
  FaShoppingBag,
  FaTruck,
  FaUsers,
  FaRecycle,
  FaSignOutAlt,
  FaHandshake,
  FaStore,
  FaCog,
  FaTools,
  FaCar,
  FaCartArrowDown,
} from 'react-icons/fa';
import './Navbar.css';

interface User {
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  coins?: number;
}

interface NavbarProps {
  onMenuToggle: () => void;
  menuOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'user' | 'collector' | 'admin';
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  menuOpen,
  activeTab,
  onTabChange,
  role,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Simulate login for different roles
  const handleUserLogin = () => {
    setUser({
      name: 'Anand',
      email: 'anand@example.com',
      role: 'user',
      coins: 250,
    });
    navigate('/dashboard');
  };

  const handleCollectorLogin = () => {
    setUser({
      name: 'Collector',
      email: 'collector@example.com',
      role: 'collector',
    });
    navigate('/dashboard');
  };

  const handleAdminLogin = () => {
    setUser({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
    setNotificationsOpen(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onMenuToggle();
  };

  const notifications = [
    {
      id: 1,
      message: 'Your service request has been confirmed',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      message: 'Your vehicle is ready for pickup',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: 'New service packages available',
      time: '2 hours ago',
      read: true,
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const isLoggedIn = !!user || location.pathname === '/dashboard';

  return (
    <>
      <nav className="navbar-janatha">
        {/* Show Hamburger only after login */}
        {isLoggedIn && (
          <button
            className="hamburger-menu-btn"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FaTimes className="hamburger-icon" />
            ) : (
              <FaBars className="hamburger-icon" />
            )}
          </button>
        )}

        {/* Brand always visible */}
        <Link className="navbar-brand" to="/">
          
          <span className="brand-text">Janatha Garage</span>
        </Link>

        <div className="navbar-content">
          {/* Before Login */}
          {!isLoggedIn && (
            <div className="auth-buttons">
              <Link className="nav-link login-btn" to="/login">
                Login
              </Link>
              <Link className="nav-link register-btn" to="/register">
                Register
              </Link>
            </div>
          )}

          {/* After Login */}
          {isLoggedIn && (
            <div className="user-section">
              {role === 'user' && (
                <div className="coins-display">
                  <FaCoins className="coins-icon" />
                  <span className="coins-amount">{user?.coins || 250}</span>
                  <span className="coins-label">Points</span>
                </div>
              )}

              {/* Notifications */}
              <div className="notifications-dropdown">
                <button
                  className="notification-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <FaBell className="notification-icon" />
                  {unreadNotifications > 0 && (
                    <span className="notification-badge">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="notifications-menu">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <span className="notifications-count">
                        {unreadNotifications} unread
                      </span>
                    </div>
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${
                            notification.read ? 'read' : 'unread'
                          }`}
                        >
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <span className="notification-time">
                            {notification.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="notifications-footer">
                      <button className="view-all-btn">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="profile-dropdown">
                <button
                  className="profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="profile-icon" />
                  <span className="profile-name">{user?.name || 'User'}</span>
                  <span className="user-role">{role}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <span className="user-name">{user?.name || 'User'}</span>
                      <span className="user-email">
                        {user?.email || 'user@example.com'}
                      </span>
                      <span className="user-role-badge">{role}</span>
                    </div>
                    <Link
                      className="dropdown-item"
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {role === 'user' && (
                      <Link
                        className="dropdown-item"
                        to="/rewards"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Rewards
                      </Link>
                    )}
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="mobile-menu-overlay active" onClick={onMenuToggle} />}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-brand">
            
            <span className="mobile-menu-title">Janatha Garage</span>
          </div>
        </div>

        <nav className="mobile-menu-nav">
          {/* Common for all roles */}
          <button
            className={`mobile-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <FaChartLine className="mobile-menu-item-icon" />
            <span>Dashboard Overview</span>
          </button>

          {/* User specific routes */}
          {role === 'user' && (
            <>
              <button
                className={`mobile-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => handleTabChange('bookings')}
              >
                <FaCalendar className="mobile-menu-item-icon" />
                <span>Book Service</span>
              </button>

              <button
                className={`mobile-menu-item ${activeTab === 'status' ? 'active' : ''}`}
                onClick={() => handleTabChange('status')}
              >
                <FaListAlt className="mobile-menu-item-icon" />
                <span>Track Status</span>
              </button>

              <button
                className={`mobile-menu-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabChange('products')}
              >
                <FaCartArrowDown className="mobile-menu-item-icon" />
                <span>Eco Store</span>
              </button>
            </>
          )}

          {/* Collector specific routes */}
          {role === 'collector' && (
            <button
              className={`mobile-menu-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => handleTabChange('requests')}
            >
              <FaTruck className="mobile-menu-item-icon" />
              <span>Service Requests</span>
            </button>
          )}

          {/* Admin specific routes */}
          {role === 'admin' && (
            <>
              <button
                className={`mobile-menu-item ${activeTab === 'management' ? 'active' : ''}`}
                onClick={() => handleTabChange('management')}
              >
                <FaUsers className="mobile-menu-item-icon" />
                <span>User Management</span>
              </button>

              <button
                className={`mobile-menu-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabChange('products')}
              >
                <FaStore className="mobile-menu-item-icon" />
                <span>Inventory Management</span>
              </button>

              <button
                className={`mobile-menu-item ${activeTab === 'partners' ? 'active' : ''}`}
                onClick={() => handleTabChange('partners')}
              >
                <FaHandshake className="mobile-menu-item-icon" />
                <span>Partner Management</span>
              </button>

              <button
                className={`mobile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleTabChange('settings')}
              >
                <FaCog className="mobile-menu-item-icon" />
                <span>Settings</span>
              </button>

              {/* Admin Quick Actions */}
              <div className="admin-quick-actions">
                <h4>Quick Actions</h4>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleTabChange('products')}
                >
                  <FaStore />
                  <span>Add Part</span>
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleTabChange('partners')}
                >
                  <FaHandshake />
                  <span>Add Partner</span>
                </button>
              </div>
            </>
          )}
        </nav>

        <div className="mobile-menu-logout">
          <button className="mobile-menu-item mobile-logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="mobile-menu-item-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
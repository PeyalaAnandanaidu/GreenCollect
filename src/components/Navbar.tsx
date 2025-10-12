import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  FaUserCircle,
  FaBell,
  FaCoins,
  FaBars,
  FaTimes,
  FaChartLine,
  FaCalendar,
  FaListAlt,
  FaTruck,
  FaUsers,
  FaSignOutAlt,
  FaHandshake,
  FaStore,
  FaCog,
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
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  menuOpen,
  activeTab,
  onTabChange,
  role,
  onLogout,
  isLoggedIn = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // Update user state when login status or role changes
  useEffect(() => {
    if (isLoggedIn) {
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: role,
        coins: role === 'user' ? 250 : 0,
      });
    } else {
      setUser(null);
    }
  }, [isLoggedIn, role]);

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

  const handleDashboardOverview = () => {
    onTabChange('overview');
    navigate('/dashboard');
    onMenuToggle(); // Close the mobile menu
  };

  const handleBookService = () => {
    onTabChange('bookings');
    navigate('/dashboard');
    onMenuToggle(); // Close the mobile menu
  };

  const handleEcoStore = () => {
    onTabChange('products');
    navigate('/dashboard');
    onMenuToggle(); // Close the mobile menu
  };

  const handleTrackStatus = () => {
    onTabChange('status');
    navigate('/status');
    onMenuToggle(); // Close the mobile menu
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
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

  // Check if user is logged in - include all protected pages
  const shouldShowLoggedInUI = isLoggedIn || 
                              location.pathname === '/dashboard' || 
                              location.pathname === '/status' ||
                              location.pathname === '/profile';

  // Close notifications when clicking anywhere outside the notifications menu while on protected pages
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const onProtectedPage = location.pathname.startsWith('/dashboard') || 
                             location.pathname.startsWith('/status') ||
                             location.pathname.startsWith('/profile');
      if (!onProtectedPage) return;
      if (
        notificationsOpen &&
        notificationsRef.current &&
        e.target instanceof Node &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [notificationsOpen, location.pathname]);

  return (
    <>
      <nav className="navbar-janatha">
        {/* Show Hamburger only when logged in or on protected pages */}
        {shouldShowLoggedInUI && (
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
          {!shouldShowLoggedInUI && (
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
          {shouldShowLoggedInUI && (
            <div className="user-section">
              {role === 'user' && (
                <div
                  className="coins-display"
                  role="button"
                  tabIndex={0}
                  title="Go to Eco Store"
                  onClick={handleEcoStore}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEcoStore();
                    }
                  }}
                >
                  <FaCoins className="coins-icon" />
                  <span className="coins-amount">{user?.coins || 250}</span>
                  <span className="coins-label">Points</span>
                </div>
              )}

              {/* Notifications */}
              <div className="notifications-dropdown" ref={notificationsRef}>
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
                  <FaUserCircle 
                    className="profile-icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick();
                    }}
                  />
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
                    <button
                      className="dropdown-item"
                      onClick={handleDashboardOverview}
                    >
                      Dashboard
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      My Profile
                    </button>
                    {role === 'user' && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          // Navigate to rewards page
                          setDropdownOpen(false);
                        }}
                      >
                        My Rewards
                      </button>
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

      {/* Mobile Menu - Only show when logged in */}
      {shouldShowLoggedInUI && (
        <div className={`mobile-menu ${menuOpen ? 'menu-open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-brand">
              <span className="mobile-menu-title">Janatha Garage</span>
            </div>
          </div>

          <nav className="mobile-menu-nav">
            {/* Common for all roles - Updated Dashboard Overview button */}
            <button
              className={`mobile-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={handleDashboardOverview}
            >
              <FaChartLine className="mobile-menu-item-icon" />
              <span>Dashboard Overview</span>
            </button>

            {/* User specific routes */}
            {role === 'user' && (
              <>
                <button
                  className={`mobile-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={handleBookService}
                >
                  <FaCalendar className="mobile-menu-item-icon" />
                  <span>Book Service</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'status' ? 'active' : ''}`}
                  onClick={handleTrackStatus}
                >
                  <FaListAlt className="mobile-menu-item-icon" />
                  <span>Track Status</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={handleEcoStore}
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
                onClick={() => {
                  onTabChange('requests');
                  navigate('/dashboard');
                  onMenuToggle();
                }}
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
                  onClick={() => {
                    onTabChange('management');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaUsers className="mobile-menu-item-icon" />
                  <span>User Management</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('products');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaStore className="mobile-menu-item-icon" />
                  <span>Inventory Management</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'partners' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('partners');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaHandshake className="mobile-menu-item-icon" />
                  <span>Partner Management</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('settings');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaCog className="mobile-menu-item-icon" />
                  <span>Settings</span>
                </button>

                {/* Admin Quick Actions */}
                <div className="admin-quick-actions">
                  <h4>Quick Actions</h4>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      onTabChange('products');
                      navigate('/dashboard');
                      onMenuToggle();
                    }}
                  >
                    <FaStore />
                    <span>Add Part</span>
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      onTabChange('partners');
                      navigate('/dashboard');
                      onMenuToggle();
                    }}
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
      )}
    </>
  );
};

export default Navbar;
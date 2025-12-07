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
  FaCartArrowDown,
  FaTrophy,
} from 'react-icons/fa';
import './Navbar.css';
import { useCart } from '../contexts/CartContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  points?: number;
  memberSince?: string;
  avatar?: string;
  collectorInfo?: {
    phone?: string;
    address?: string;
    vehicleType?: string;
    vehicleNumberPlate?: string;
    experience?: string;
    isApproved?: boolean;
  };
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const cart = (() => {
    try {
      return useCart();
    } catch (e) {
      return null;
    }
  })();

  // Load user data from storage when component mounts or login status changes
  useEffect(() => {
    const loadUserData = () => {
      try {
        const loginMethod = localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');
        const storage = loginMethod === 'local' ? localStorage : sessionStorage;
        
        const userData = storage.getItem('user');
        const savedAvatar = localStorage.getItem('profile.avatar');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Navbar loaded user:', parsedUser);
        }
        
        if (savedAvatar) {
          setAvatarUrl(savedAvatar);
        }
      } catch (error) {
        console.error('Error loading user data in Navbar:', error);
      }
    };

    if (isLoggedIn) {
      loadUserData();
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  // Also load user data when location changes (in case user logs in on another tab)
  useEffect(() => {
    const loadUserData = () => {
      try {
        const loginMethod = localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');
        const storage = loginMethod === 'local' ? localStorage : sessionStorage;
        
        const userData = storage.getItem('user');
        const savedAvatar = localStorage.getItem('profile.avatar');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
        
        if (savedAvatar) {
          setAvatarUrl(savedAvatar);
        }
      } catch (error) {
        console.error('Error loading user data in Navbar:', error);
      }
    };

    loadUserData();
  }, [location.pathname]);

  // Refresh user data when coins might have changed (after pickup completion)
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token || !user) return;

        // Fetch updated user data to get latest coins
        const response = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.success && userData.user) {
            setUser(userData.user);
            // Update storage as well
            const loginMethod = localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');
            const storage = loginMethod === 'local' ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(userData.user));
          }
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    // Refresh when on dashboard or status page where coins might change
    if (location.pathname === '/dashboard' || location.pathname === '/status') {
      refreshUserData();
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    setUser(null);
    setAvatarUrl(null);
    setDropdownOpen(false);
    setNotificationsOpen(false);
    
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('profile.avatar');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginMethod');
    
    if (onLogout) onLogout();
    navigate('/');
  };

  // onTabChange is already supplied via props; callers should use onTabChange directly.

  const handleDashboardOverview = () => {
    onTabChange('overview');
    navigate('/dashboard');
    onMenuToggle();
  };

  const handleBookService = () => {
    onTabChange('bookings');
    navigate('/dashboard');
    onMenuToggle();
  };

  const handleEcoStore = () => {
    onTabChange('products');
    navigate('/dashboard');
    onMenuToggle();
  };

  const handleCart = () => {
    onMenuToggle();
    navigate('/cart');
  };

  const handleOrganisation = () => {
    onMenuToggle();
    navigate('/organisation');
  };

  const handleTrackStatus = () => {
    onTabChange('status');
    navigate('/status');
    onMenuToggle();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const notifications = [
    {
      id: 1,
      message: 'Your pickup request has been confirmed',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      message: 'Collector is on the way to pickup your waste',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: 'You earned 150 coins from your last pickup!',
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
                
                      <button
                        className={`mobile-menu-item`}
                        onClick={handleOrganisation}
                      >
                        <FaUsers className="mobile-menu-item-icon" />
                        <span>Organisation Request</span>
                      </button>

  // Get user display name (fallback to role if no name)
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get user display email
  const getUserDisplayEmail = () => {
    if (user?.email) return user.email;
    return `${role}@janathagarage.com`;
  };

  // Get user points/coins - NEW USERS START WITH 0
  const getUserPoints = () => {
    if (user?.points !== undefined && user?.points !== null) {
      return user.points;
    }
    return 0; // All new users start with 0 coins
  };

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
                  <span className="coins-amount">{getUserPoints()}</span>
                  <span className="coins-label">Coins</span>
                </div>
              )}
              {role === 'user' && (
                <button className="cart-btn" title="View Cart" onClick={handleCart} style={{ position: 'relative' }}>
                  <FaCartArrowDown />
                  {cart && cart.items.length > 0 && (
                    <span className="cart-badge">{cart.items.length}</span>
                  )}
                </button>
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
                  <div className="profile-avatar-container">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="profile-avatar"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick();
                        }}
                      />
                    ) : (
                      <FaUserCircle 
                        className="profile-icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick();
                        }}
                      />
                    )}
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{getUserDisplayName()}</span>
                    <span className="user-role">{role}</span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <div className="user-avatar-container">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="user-avatar"
                          />
                        ) : (
                          <FaUserCircle className="user-avatar-icon" />
                        )}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{getUserDisplayName()}</span>
                        <span className="user-email">
                          {getUserDisplayEmail()}
                        </span>
                        <span className={`user-role-badge ${role}`}>
                          {role === 'collector' 
                            ? user?.collectorInfo?.isApproved 
                              ? 'Approved Collector' 
                              : 'Pending Collector'
                            : role.charAt(0).toUpperCase() + role.slice(1)
                          }
                        </span>
                        {role === 'user' && (
                          <span className="user-coins">
                            <FaCoins className="coins-icon-small" />
                            {getUserPoints()} Coins
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="dropdown-item"
                      onClick={handleDashboardOverview}
                    >
                      <FaChartLine className="dropdown-item-icon" />
                      Dashboard
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      <FaUserCircle className="dropdown-item-icon" />
                      My Profile
                    </button>
                    {role === 'user' && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          handleEcoStore();
                          setDropdownOpen(false);
                        }}
                      >
                        <FaCoins className="dropdown-item-icon" />
                        My Rewards ({getUserPoints()} coins)
                      </button>
                    )}
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="dropdown-item-icon" />
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
            <div className="mobile-brand">
              <Link to="/" className="mobile-brand-link">Janatha Garage</Link>
            </div>
          </div>

          <nav className="mobile-menu-nav">
            {/* Common for all roles */}
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
                  <span>Schedule Pickup</span>
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
                  <span>Eco Store ({getUserPoints()} coins)</span>
                </button>

                <button
                  className={`mobile-menu-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('leaderboard');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaTrophy className="mobile-menu-item-icon" />
                  <span>Leaderboard</span>
                </button>

                <button
                  className={`mobile-menu-item`}
                  onClick={handleOrganisation}
                >
                  <FaUsers className="mobile-menu-item-icon" />
                  <span>Organisation Request</span>
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
                <span>Pickup Requests</span>
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
                  className={`mobile-menu-item ${activeTab === 'organisations' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('organisations');
                    navigate('/dashboard');
                    onMenuToggle();
                  }}
                >
                  <FaUsers className="mobile-menu-item-icon" />
                  <span>Organisation Requests</span>
                </button>
              </>
            )}

            {/* Profile button for all roles */}
            <button
              className="mobile-menu-item"
              onClick={handleProfileClick}
            >
              <FaUserCircle className="mobile-menu-item-icon" />
              <span>My Profile</span>
            </button>
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
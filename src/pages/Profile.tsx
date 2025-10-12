import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { FaUserCircle, FaEnvelope, FaCoins, FaEdit, FaBell, FaShieldAlt, FaHistory, FaMedal, FaPhone, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  points?: number;
  memberSince?: string;
  collectorInfo?: {
    phone?: string;
    address?: string;
    vehicleType?: string;
    vehicleNumberPlate?: string;
    experience?: string;
    isApproved?: boolean;
  };
}

interface ProfileProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  role?: 'user' | 'collector' | 'admin';
  onLogout?: () => void;
  user?: User | null;
}

const Profile: React.FC<ProfileProps> = ({ 
  onTabChange, 
  activeTab = 'profile', 
  role = 'user', 
  onLogout,
  user 
}) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; initTx: number; initTy: number }>({ dragging: false, startX: 0, startY: 0, initTx: 0, initTy: 0 });
  const viewport = 220;
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize profile with user data or defaults
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    role: user?.role || role,
    points: user?.points || 250,
    memberSince: user?.memberSince || 'Jan 2024',
    phone: user?.collectorInfo?.phone || '',
    address: user?.collectorInfo?.address || '',
    vehicleType: user?.collectorInfo?.vehicleType || '',
    vehicleNumberPlate: user?.collectorInfo?.vehicleNumberPlate || '',
    experience: user?.collectorInfo?.experience || '',
    isApproved: user?.collectorInfo?.isApproved || false
  });

  const [editForm, setEditForm] = useState({ 
    name: profile.name, 
    email: profile.email,
    phone: profile.phone,
    address: profile.address
  });
  
  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.user) {
        const userData = data.user;
        setProfile({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          points: userData.points || 250,
          memberSince: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
          phone: userData.collectorInfo?.phone || '',
          address: userData.collectorInfo?.address || '',
          vehicleType: userData.collectorInfo?.vehicleType || '',
          vehicleNumberPlate: userData.collectorInfo?.vehicleNumberPlate || '',
          experience: userData.collectorInfo?.experience || '',
          isApproved: userData.collectorInfo?.isApproved || false
        });

        setEditForm({
          name: userData.name,
          email: userData.email,
          phone: userData.collectorInfo?.phone || '',
          address: userData.collectorInfo?.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile when user prop changes or component mounts
  useEffect(() => {
    if (user) {
      // Use user data from props if available
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 250,
        memberSince: user.memberSince || 'Jan 2024',
        phone: user.collectorInfo?.phone || '',
        address: user.collectorInfo?.address || '',
        vehicleType: user.collectorInfo?.vehicleType || '',
        vehicleNumberPlate: user.collectorInfo?.vehicleNumberPlate || '',
        experience: user.collectorInfo?.experience || '',
        isApproved: user.collectorInfo?.isApproved || false
      });
    } else {
      // Fetch from backend if no user prop
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Set active tab to 'profile' when component mounts
  useEffect(() => {
    if (onTabChange) {
      onTabChange('profile');
    }
  }, [onTabChange]);

  // Load persisted avatar
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('profile.avatar');
      if (savedAvatar) setAvatarUrl(savedAvatar);
    } catch {}
  }, []);

  // Auto-open file chooser when opening editor from avatar edit action
  useEffect(() => {
    if (editorOpen) {
      const id = setTimeout(() => fileInputRef.current?.click(), 0);
      return () => clearTimeout(id);
    }
  }, [editorOpen]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  // Update profile in backend
  const updateProfile = async (updatedData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const response = await fetch('http://localhost:4000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      return false;
    }
  };

  // Format role for display
  const getRoleDisplay = () => {
    if (profile.role === 'collector') {
      return profile.isApproved ? 'Approved Collector' : 'Pending Collector';
    }
    return profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
  };

  // Get role badge color
  const getRoleBadgeClass = () => {
    switch (profile.role) {
      case 'admin': return 'role-badge admin';
      case 'collector': return profile.isApproved ? 'role-badge collector approved' : 'role-badge collector pending';
      default: return 'role-badge user';
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className={`profile-header ${mounted ? 'animate-in' : ''}`}>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account, preferences, and see your activity</p>
        </div>

        {error && (
          <div className="error-banner">
            <FaShieldAlt />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Overview Card */}
        <div className={`overview-card ${mounted ? 'animate-in delay-1' : ''}`}>
          <div className="avatar-block">
            <div className="avatar-wrapper" title="Change profile picture">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="avatar-img" />
              ) : (
                <FaUserCircle className="avatar-icon" />
              )}
              <button
                className="avatar-edit-btn"
                onClick={() => {
                  setEditorOpen(true);
                }}
              >
                <FaEdit /> Edit
              </button>
            </div>
            <div className={`role-badge ${getRoleBadgeClass()}`}>
              {getRoleDisplay()}
            </div>
          </div>
          <div className="user-meta">
            <h2 className="user-name">{profile.name}</h2>
            <div className="user-line"><FaEnvelope /> <span>{profile.email}</span></div>
            <div className="user-line"><FaHistory /> <span>Member since {profile.memberSince}</span></div>
            
            {/* Collector-specific info */}
            {profile.role === 'collector' && (
              <>
                {profile.phone && (
                  <div className="user-line"><FaPhone /> <span>{profile.phone}</span></div>
                )}
                {profile.address && (
                  <div className="user-line"><FaMapMarkerAlt /> <span>{profile.address}</span></div>
                )}
                {profile.vehicleType && (
                  <div className="user-line"><FaTruck /> <span>{profile.vehicleType} - {profile.vehicleNumberPlate}</span></div>
                )}
                {profile.experience && (
                  <div className="user-line"><FaMedal /> <span>{profile.experience}</span></div>
                )}
              </>
            )}
          </div>
          <div className="user-stats">
            <div className="points-tile">
              <FaCoins className="coins-icon" />
              <div>
                <div className="points-value">{profile.points}</div>
                <div className="points-label">Points</div>
              </div>
            </div>
            <button
              className="edit-btn"
              onClick={() => {
                setEditForm({ 
                  name: profile.name, 
                  email: profile.email,
                  phone: profile.phone,
                  address: profile.address
                });
                setProfileEditOpen(true);
              }}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>

        {/* Avatar Editor Modal */}
        {editorOpen && (
          <div className="profile-modal animate-in" role="dialog" aria-modal="true" aria-label="Edit profile picture">
            <div className="modal-content">
              <h3 className="section-title">Edit Profile Picture</h3>
              <div className="cropper">
                <div
                  className="crop-viewport"
                  style={{ width: viewport, height: viewport }}
                  onMouseDown={(e) => {
                    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, initTx: tx, initTy: ty };
                  }}
                  onMouseMove={(e) => {
                    if (!dragRef.current.dragging) return;
                    const dx = e.clientX - dragRef.current.startX;
                    const dy = e.clientY - dragRef.current.startY;
                    const img = imgElRef.current;
                    if (!img) return;
                    const dw = img.naturalWidth * scale;
                    const dh = img.naturalHeight * scale;
                    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
                    const nextTx = clamp(dragRef.current.initTx + dx, Math.min(0, viewport - dw), 0);
                    const nextTy = clamp(dragRef.current.initTy + dy, Math.min(0, viewport - dh), 0);
                    setTx(nextTx);
                    setTy(nextTy);
                  }}
                  onMouseUp={() => { dragRef.current.dragging = false; }}
                  onMouseLeave={() => { dragRef.current.dragging = false; }}
                >
                  {previewSrc ? (
                    <img
                      ref={imgElRef}
                      src={previewSrc}
                      alt="Crop source"
                      className="crop-image"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        const dw = img.naturalWidth * scale;
                        const dh = img.naturalHeight * scale;
                        setTx((viewport - dw) / 2);
                        setTy((viewport - dh) / 2);
                      }}
                      style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
                      draggable={false}
                    />
                  ) : (
                    <div className="placeholder">Choose an image</div>
                  )}
                  <div className="viewport-mask" />
                </div>
              </div>
              <div className="crop-controls">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={scale}
                  onChange={(e) => {
                    const img = imgElRef.current;
                    const newScale = Number(e.target.value);
                    if (!img) { setScale(newScale); return; }
                    const dwOld = img.naturalWidth * scale;
                    const dhOld = img.naturalHeight * scale;
                    const dwNew = img.naturalWidth * newScale;
                    const dhNew = img.naturalHeight * newScale;
                    const centerX = -tx + viewport / 2;
                    const centerY = -ty + viewport / 2;
                    const ratioX = centerX / dwOld;
                    const ratioY = centerY / dhOld;
                    const newTx = -(ratioX * dwNew - viewport / 2);
                    const newTy = -(ratioY * dhNew - viewport / 2);
                    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
                    setTx(clamp(newTx, Math.min(0, viewport - dwNew), 0));
                    setTy(clamp(newTy, Math.min(0, viewport - dhNew), 0));
                    setScale(newScale);
                  }}
                />
                <div className="file-row">
                  <label className="btn btn-outline file-btn">
                    Choose Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        if (previewSrc) URL.revokeObjectURL(previewSrc);
                        setPreviewSrc(url);
                      }}
                      hidden
                    />
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    if (previewSrc) URL.revokeObjectURL(previewSrc);
                    setPreviewSrc(null);
                    setEditorOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-yellow"
                  onClick={() => {
                    const img = imgElRef.current;
                    if (!img) return;
                    const canvas = hiddenCanvasRef.current || document.createElement('canvas');
                    hiddenCanvasRef.current = canvas;
                    const size = 320;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    const dw = img.naturalWidth * scale;
                    const dh = img.naturalHeight * scale;
                    const sx = (-tx) * (img.naturalWidth / dw);
                    const sy = (-ty) * (img.naturalHeight / dh);
                    const sWidth = viewport * (img.naturalWidth / dw);
                    const sHeight = viewport * (img.naturalHeight / dh);
                    ctx.clearRect(0, 0, size, size);
                    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);
                    const circleCanvas = document.createElement('canvas');
                    circleCanvas.width = size;
                    circleCanvas.height = size;
                    const cctx = circleCanvas.getContext('2d');
                    if (cctx) {
                      cctx.save();
                      cctx.beginPath();
                      cctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                      cctx.closePath();
                      cctx.clip();
                      cctx.drawImage(canvas, 0, 0);
                      cctx.restore();
                      const data = circleCanvas.toDataURL('image/png');
                      setAvatarUrl(data);
                      try { localStorage.setItem('profile.avatar', data); } catch {}
                    } else {
                      const data = canvas.toDataURL('image/png');
                      setAvatarUrl(data);
                      try { localStorage.setItem('profile.avatar', data); } catch {}
                    }
                    if (previewSrc) URL.revokeObjectURL(previewSrc);
                    setPreviewSrc(null);
                    setEditorOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {profileEditOpen && (
          <div className="profile-modal animate-in" role="dialog" aria-modal="true" aria-label="Edit profile details">
            <div className="modal-content">
              <h3 className="section-title">Edit Profile</h3>
              <form
                className="modal-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  
                  try {
                    const success = await updateProfile({
                      name: editForm.name,
                      email: editForm.email,
                      phone: editForm.phone,
                      address: editForm.address
                    });

                    if (success) {
                      const updatedProfile = { 
                        ...profile, 
                        name: editForm.name, 
                        email: editForm.email,
                        phone: editForm.phone,
                        address: editForm.address
                      };
                      setProfile(updatedProfile);
                      
                      // Save to localStorage as backup
                      try { 
                        localStorage.setItem('profile.details', JSON.stringify({ 
                          name: updatedProfile.name, 
                          email: updatedProfile.email,
                          phone: updatedProfile.phone,
                          address: updatedProfile.address
                        })); 
                      } catch {}
                      
                      setProfileEditOpen(false);
                    }
                  } catch (error) {
                    console.error('Error updating profile:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="form-row">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                
                {/* Additional fields for collectors */}
                {profile.role === 'collector' && (
                  <>
                    <div className="form-row">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </>
                )}
                
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setProfileEditOpen(false)} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-yellow" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid sections */}
        <div className={`profile-grid ${mounted ? 'animate-in delay-2' : ''}`}>
          <section className="glass-card">
            <h3 className="section-title">Account Settings</h3>
            <div className="settings-list">
              <div className="setting-row">
                <div className="setting-left"><FaEnvelope /> Email</div>
                <div className="setting-right">{profile.email}</div>
              </div>
              <div className="setting-row">
                <div className="setting-left"><FaShieldAlt /> Password</div>
                <div className="setting-right"><button className="btn btn-outline">Change</button></div>
              </div>
              <div className="setting-row">
                <div className="setting-left"><FaBell /> Notifications</div>
                <div className="setting-right"><button className="btn btn-yellow">Manage</button></div>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <h3 className="section-title">Recent Activity</h3>
            <ul className="activity-list">
              <li className="activity-item">Earned 50 points from completed pickup</li>
              <li className="activity-item">Updated address in profile</li>
              <li className="activity-item">Scheduled a plastic collection</li>
            </ul>
          </section>

          <section className="glass-card">
            <h3 className="section-title">Badges</h3>
            <div className="badges">
              <div className="badge"><FaMedal /> Starter</div>
              <div className="badge"><FaMedal /> Recycler</div>
              <div className="badge"><FaMedal /> Eco Hero</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
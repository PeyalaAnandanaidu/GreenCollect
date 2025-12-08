import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { 
    FaUsers, FaUserCheck, FaChartLine, FaCheck, FaTimes, 
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, 
    FaRecycle, FaTruck, FaPlus
} from 'react-icons/fa';
import ProductManagement from './ProductManagement';
import AdminOrganisations from './AdminOrganisations';

interface AdminDashboardProps {
    activeTab: string;
}

interface CollectorRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    vehicleType: string;
    vehicleNumber: string;
    experience: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

    interface RecycledPartner {
    id: number;
    name: string;
    type: string;
    location: string;
    contact: string;
    wasteProcessed: string;
    rating: number;
    establishingYear?: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
    const [collectorRequests, setCollectorRequests] = useState<CollectorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCollectors] = useState([
        { id: 1, name: 'Rahul Verma', completedPickups: 45, rating: 4.8 },
        { id: 2, name: 'Sneha Patel', completedPickups: 38, rating: 4.9 },
        { id: 3, name: 'Ankit Joshi', completedPickups: 52, rating: 4.7 },
        { id: 4, name: 'Meera Reddy', completedPickups: 29, rating: 4.6 }
    ]);

    const [recycledPartners, setRecycledPartners] = useState<RecycledPartner[]>([]);

    const [showAddPartner, setShowAddPartner] = useState(false);
    const [partnerForm, setPartnerForm] = useState({
        name: '',
        type: '',
        location: '',
        contact: '',
        wasteProcessed: '',
        rating: 0,
        establishingYear: new Date().getFullYear()
    });

    const handleOpenAddPartner = () => {
        setPartnerForm({ name: '', type: '', location: '', contact: '', wasteProcessed: '', rating: 0, establishingYear: new Date().getFullYear() });
        setShowAddPartner(true);
    };

    const handleAddPartnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const newPartner = {
            companyName: partnerForm.name,
            establishingYear: partnerForm.establishingYear,
            type: partnerForm.type,
            location: partnerForm.location,
            contact: partnerForm.contact,
            wasteProcessed: partnerForm.wasteProcessed,
            rating: partnerForm.rating
        };
    
        try {
            const response = await fetch('https://greencollect.onrender.com/api/partners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPartner)
            });
    
            if (!response.ok) throw new Error('Failed to add partner');
    
            const data = await response.json();
            setRecycledPartners(prev => [data.company, ...prev]);
            setShowAddPartner(false);
        } catch (error) {
            console.error('Error adding partner:', error);
            alert('Failed to add partner');
        }
    };
    
    useEffect(() => {
        if (activeTab === 'partners') {
            fetchPartners();
        }
    }, [activeTab]);
    
    const fetchPartners = async () => {
        try {
            const response = await fetch('https://greencollect.onrender.com/api/partners');
            if (!response.ok) throw new Error('Failed to fetch partners');
            const data = await response.json();
            setRecycledPartners(data.companies);
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };
    
    // Fetch collector requests from backend
    const fetchCollectorRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://greencollect.onrender.com/api/admin/collector-requests');
            if (response.ok) {
                const data = await response.json();
                // Transform backend data to match frontend interface
                const requests: CollectorRequest[] = data.map((user: any) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.collectorInfo?.phone || 'N/A',
                    address: user.collectorInfo?.address || 'N/A',
                    vehicleType: user.collectorInfo?.vehicleType || 'N/A',
                    vehicleNumber: user.collectorInfo?.vehicleNumberPlate || 'N/A',
                    experience: user.collectorInfo?.experience || 'No experience provided',
                    submittedAt: new Date(user.createdAt).toLocaleString(),
                    status: user.collectorInfo?.isApproved ? 'approved' : 'pending'
                }));
                setCollectorRequests(requests);
            }
        } catch (error) {
            console.error('Error fetching collector requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'management' || activeTab === 'overview') {
            fetchCollectorRequests();
        }
    }, [activeTab]);

    const handleApproveRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`https://greencollect.onrender.com/api/users/approve-collector/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isApproved: true })
            });

            if (response.ok) {
                setCollectorRequests(prev => 
                    prev.map(request => 
                        request.id === requestId 
                            ? { ...request, status: 'approved' }
                            : request
                    )
                );
                console.log(`✅ Approved collector request: ${requestId}`);
            } else {
                const errorData = await response.json();
                console.error('Failed to approve collector:', errorData);
                alert(`Failed to approve collector: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error approving collector:', error);
            alert('Network error while approving collector. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`https://greencollect.onrender.com/api/users/approve-collector/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isApproved: false })
            });

            if (response.ok) {
                setCollectorRequests(prev => 
                    prev.filter(request => request.id !== requestId)
                );
                console.log(`✅ Rejected collector request: ${requestId}`);
            } else {
                const errorData = await response.json();
                console.error('Failed to reject collector:', errorData);
                alert(`Failed to reject collector: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error rejecting collector:', error);
            alert('Network error while rejecting collector. Please try again.');
        }
    };

    const pendingRequests = collectorRequests.filter(req => req.status === 'pending');
    const approvedRequests = collectorRequests.filter(req => req.status === 'approved');
    // const rejectedRequests = collectorRequests.filter(req => req.status === 'rejected');

    if (loading) {
        return (
            <div className="admin-dashboard">
                <main className="main-content">
                    <div className="loading-state">
                        <p>Loading collector requests...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Admin Dashboard'}
                        {activeTab === 'management' && 'User Management'}
                        {activeTab === 'products' && 'Product Management'}
                        {activeTab === 'partners' && 'Recycling Partners'}
                        {activeTab === 'organisations' && 'Organisation Requests'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Monitor platform activity and statistics'}
                        {activeTab === 'management' && 'Manage users, collectors, and platform settings'}
                        {activeTab === 'products' && 'Add and manage eco-store products'}
                        {activeTab === 'partners' && 'View and manage recycling partners'}
                        {activeTab === 'organisations' && 'View and manage organisation collection requests'}
                    </p>
                </div>

                {activeTab === 'overview' && (
                    <div className="admin-overview">
                        {/* Enhanced Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-users">
                                    <FaUsers />
                                </div>
                                <div className="stat-content">
                                    <h3>1,240</h3>
                                    <p>Total Users</p>
                                    <span className="stat-trend positive">+15% growth</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-collectors">
                                    <FaTruck />
                                </div>
                                <div className="stat-content">
                                    <h3>{activeCollectors.length}</h3>
                                    <p>Active Collectors</p>
                                    <span className="stat-trend positive">+5 this month</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-pending">
                                    <FaUserCheck />
                                </div>
                                <div className="stat-content">
                                    <h3>{pendingRequests.length}</h3>
                                    <p>Pending Approvals</p>
                                    <span className="stat-trend negative">-2 from last week</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-partners">
                                    <FaRecycle />
                                </div>
                                <div className="stat-content">
                                    <h3>{recycledPartners.length}</h3>
                                    <p>Recycling Partners</p>
                                    <span className="stat-trend positive">+3 new partners</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-revenue">
                                    <FaChartLine />
                                </div>
                                <div className="stat-content">
                                    <h3>₹89,240</h3>
                                    <p>Total Revenue</p>
                                    <span className="stat-trend positive">+25% growth</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-waste">
                                    <FaRecycle />
                                </div>
                                <div className="stat-content">
                                    <h3>2.5K kg</h3>
                                    <p>Waste Recycled</p>
                                    <span className="stat-trend positive">+18% this month</span>
                                </div>
                            </div>
                        </div>

                        <div className="overview-content">
                            {/* Quick Requests */}
                            <div className="overview-section">
                                <div className="section-header">
                                    <h3>Recent Collector Requests</h3>
                                    <span className="badge">{pendingRequests.length} pending</span>
                                </div>
                                {pendingRequests.slice(0, 3).map(request => (
                                    <div key={request.id} className="quick-request-card">
                                        <div className="request-basic-info">
                                            <h4>{request.name}</h4>
                                            <p>{request.vehicleType} • {request.vehicleNumber}</p>
                                            <span className="request-meta">{request.email}</span>
                                        </div>
                                        <div className="request-actions">
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleApproveRequest(request.id)}
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRejectRequest(request.id)}
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {pendingRequests.length === 0 && (
                                    <div className="empty-state-small">
                                        <p>No pending requests</p>
                                    </div>
                                )}
                            </div>

                            {/* Active Collectors */}
                            <div className="overview-section">
                                <div className="section-header">
                                    <h3>Top Collectors</h3>
                                    <span className="badge">{activeCollectors.length} active</span>
                                </div>
                                {activeCollectors.map(collector => (
                                    <div key={collector.id} className="collector-card">
                                        <div className="collector-avatar">
                                            {collector.name.charAt(0)}
                                        </div>
                                        <div className="collector-info">
                                            <h4>{collector.name}</h4>
                                            <p>{collector.completedPickups} pickups • ⭐ {collector.rating}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recycling Partners */}
                            <div className="overview-section">
                                <div className="section-header">
                                    <h3>Recycling Partners</h3>
                                    <span className="badge">{recycledPartners.length} partners</span>
                                </div>
                                {recycledPartners.map(partner => (
                                    <div key={partner.id} className="partner-card">
                                        <div className="partner-info">
                                            <h4>{partner.name}</h4>
                                            <p>{partner.type}</p>
                                            <span className="partner-meta">
                                                📍 {partner.location} • 🏆 {partner.rating}/5
                                            </span>
                                        </div>
                                        <div className="partner-stats">
                                            <span className="waste-processed">{partner.wasteProcessed}</span>
                                            <span>processed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'management' && (
                    <div className="tab-content">
                        <div className="management-container">
                            {/* Stats Overview */}
                            <div className="management-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{pendingRequests.length}</div>
                                    <div className="stat-label">Pending Requests</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{approvedRequests.length}</div>
                                    <div className="stat-label">Approved Collectors</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{activeCollectors.length}</div>
                                    <div className="stat-label">Active Collectors</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">1,240</div>
                                    <div className="stat-label">Total Users</div>
                                </div>
                            </div>

                            {/* Collector Requests Section */}
                            <div className="requests-section">
                                <div className="section-header">
                                    <h2>Collector Registration Requests</h2>
                                    <p>Review and manage collector registration applications</p>
                                </div>

                                {/* Pending Requests */}
                                <div className="requests-category">
                                    <h3>Pending Approval ({pendingRequests.length})</h3>
                                    {pendingRequests.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-icon">✅</div>
                                            <h4>No pending requests</h4>
                                            <p>All collector requests have been processed</p>
                                        </div>
                                    ) : (
                                        <div className="requests-grid">
                                            {pendingRequests.map(request => (
                                                <div key={request.id} className="request-card pending">
                                                    <div className="request-header">
                                                        <h4>{request.name}</h4>
                                                        <span className="request-date">
                                                            <FaClock /> {request.submittedAt}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="request-details">
                                                        <div className="detail-row">
                                                            <FaEnvelope className="detail-icon" />
                                                            <span>{request.email}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <FaPhone className="detail-icon" />
                                                            <span>{request.phone}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <FaMapMarkerAlt className="detail-icon" />
                                                            <span>{request.address}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <strong className='side-heading'>Vehicle:</strong>
                                                            <span>{request.vehicleType} ({request.vehicleNumber})</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <strong className='side-heading'>Experience:</strong>
                                                            <span>{request.experience}</span>
                                                        </div>
                                                    </div>

                                                    <div className="request-actions">
                                                        <button 
                                                            className="btn btn-success"
                                                            onClick={() => handleApproveRequest(request.id)}
                                                        >
                                                            <FaCheck /> Approve Collector
                                                        </button>
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => handleRejectRequest(request.id)}
                                                        >
                                                            <FaTimes /> Reject Request
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Approved Requests */}
                                {approvedRequests.length > 0 && (
                                    <div className="requests-category">
                                        <h3>Approved Collectors ({approvedRequests.length})</h3>
                                        <div className="requests-grid">
                                            {approvedRequests.map(request => (
                                                <div key={request.id} className="request-card approved">
                                                    <div className="request-header">
                                                        <h4>{request.name}</h4>
                                                        <span className="status-badge approved">Approved</span>
                                                    </div>
                                                    <div className="request-details">
                                                        <div className="detail-row">
                                                            <FaEnvelope className="detail-icon" />
                                                            <span>{request.email}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <FaPhone className="detail-icon" />
                                                            <span>{request.phone}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <strong className='side-heading'>Vehicle:</strong>
                                                            <span>{request.vehicleType} ({request.vehicleNumber})</span>
                                                        </div>
                                                    </div>
                                                    <div className="request-actions">
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => handleRejectRequest(request.id)}
                                                        >
                                                            <FaTimes /> Revoke Access
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <ProductManagement />
                )}

                {activeTab === 'partners' && (
                    <div className="tab-content">
                        <div className="partners-container">
                            <div className="section-header">
                                <h2>Recycling Partners</h2>
                                <p>Manage our network of recycling and waste processing partners</p>
                            </div>

                            <div className="partners-stats">
                                <div className="partner-stat">
                                    <div className="stat-number">{recycledPartners.length}</div>
                                    <div className="stat-label">Total Partners</div>
                                </div>
                                <div className="partner-stat">
                                    <div className="stat-number">3</div>
                                    <div className="stat-label">Partner Types</div>
                                </div>
                                <div className="partner-stat">
                                    <div className="stat-number">405 tons</div>
                                    <div className="stat-label">Total Waste Processed</div>
                                </div>
                                <div className="partner-stat">
                                    <div className="stat-number">4.7/5</div>
                                    <div className="stat-label">Average Rating</div>
                                </div>
                            </div>

                            <div className="partners-grid">
                                {recycledPartners.map(partner => (
                                    <div key={partner.id} className="partner-detail-card">
                                        <div className="partner-header">
                                            <h3>{partner.name}</h3>
                                            <div className="partner-rating">
                                                ⭐ {partner.rating}
                                            </div>
                                        </div>
                                        <div className="partner-type">
                                            {partner.type}
                                        </div>
                                        <div className="partner-details">
                                            <div className="detail">
                                                <strong style={{ color: 'white'}}>Location:</strong>
                                                <span>{partner.location}</span>
                                            </div>
                                            <div className="detail">
                                                <strong style={{ color: 'white'}}>Contact:</strong>
                                                <span>{partner.contact}</span>
                                            </div>
                                            <div className="detail">
                                                <strong style={{ color: 'white'}}>Waste Processed:</strong>
                                                <span className="waste-amount">{partner.wasteProcessed}</span>
                                            </div>
                                        </div>
                                        <div className="partner-actions">
                                            <button className="btn btn-outline">View Details</button>
                                            <button className="btn btn-primary">Contact</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="add-partner-section">
                                <button className="btn btn-success" onClick={handleOpenAddPartner}>
                                    <FaPlus /> Add New Partner
                                </button>
                            </div>

                            {/* Add Partner Modal */}
                            {showAddPartner && (
                                <div className="partner-form-overlay">
                                    <div className="partner-form">
                                        <div className="form-header">
                                            <h3>Add New Partner</h3>
                                            <button className="close-btn" onClick={() => setShowAddPartner(false)}>×</button>
                                        </div>
                                        <form onSubmit={handleAddPartnerSubmit}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Company Name</label>
                                                    <input type="text" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Establishing Year</label>
                                                    <input type="number" value={partnerForm.establishingYear} onChange={e => setPartnerForm({...partnerForm, establishingYear: parseInt(e.target.value || '0')})} min="1900" max={new Date().getFullYear()} />
                                                </div>
                                                <div className="form-group full-width">
                                                    <label>Type (e.g., Plastic Recycling)</label>
                                                    <input type="text" value={partnerForm.type} onChange={e => setPartnerForm({...partnerForm, type: e.target.value})} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Location</label>
                                                    <input type="text" value={partnerForm.location} onChange={e => setPartnerForm({...partnerForm, location: e.target.value})} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Contact Email/Phone</label>
                                                    <input type="text" value={partnerForm.contact} onChange={e => setPartnerForm({...partnerForm, contact: e.target.value})} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Waste Processed (e.g., 50 tons)</label>
                                                    <input type="text" value={partnerForm.wasteProcessed} onChange={e => setPartnerForm({...partnerForm, wasteProcessed: e.target.value})} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Rating (0-5)</label>
                                                    <input type="number" value={partnerForm.rating} onChange={e => setPartnerForm({...partnerForm, rating: parseFloat(e.target.value || '0')})} min="0" max="5" step="0.1" />
                                                </div>
                                            </div>
                                            <div className="form-actions">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddPartner(false)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">Add Partner</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'organisations' && (
                    <div className="tab-content">
                        <AdminOrganisations />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
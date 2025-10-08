import { useState } from 'react';
import './AdminDashboard.css';
import { 
    FaUsers, FaUserCheck, FaChartLine, FaCheck, FaTimes, 
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, 
    FaRecycle, FaTruck, FaStore, FaPlus 
} from 'react-icons/fa';
import ProductManagement from './ProductManagement';

interface AdminDashboardProps {
    activeTab: string;
}

interface CollectorRequest {
    id: number;
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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
    const [collectorRequests, setCollectorRequests] = useState<CollectorRequest[]>([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210',
            address: '123 MG Road, Bangalore, Karnataka',
            vehicleType: 'Pickup Truck',
            vehicleNumber: 'KA01AB1234',
            experience: '2 years in waste collection',
            submittedAt: '2024-01-15 10:30:00',
            status: 'pending'
        },
        {
            id: 2,
            name: 'Priya Singh',
            email: 'priya@example.com',
            phone: '+91 8765432109',
            address: '456 Koramangala, Bangalore, Karnataka',
            vehicleType: 'Three-wheeler',
            vehicleNumber: 'KA02CD5678',
            experience: '1 year in logistics',
            submittedAt: '2024-01-14 14:20:00',
            status: 'pending'
        }
    ]);

    const [activeCollectors] = useState([
        { id: 1, name: 'Rahul Verma', completedPickups: 45, rating: 4.8 },
        { id: 2, name: 'Sneha Patel', completedPickups: 38, rating: 4.9 },
        { id: 3, name: 'Ankit Joshi', completedPickups: 52, rating: 4.7 },
        { id: 4, name: 'Meera Reddy', completedPickups: 29, rating: 4.6 }
    ]);

    const [recycledPartners] = useState<RecycledPartner[]>([
        {
            id: 1,
            name: 'GreenTech Recyclers',
            type: 'Plastic Recycling',
            location: 'Bangalore',
            contact: 'contact@greentech.com',
            wasteProcessed: '120 tons',
            rating: 4.8
        },
        {
            id: 2,
            name: 'EcoPaper Solutions',
            type: 'Paper Recycling',
            location: 'Mumbai',
            contact: 'info@ecopaper.com',
            wasteProcessed: '85 tons',
            rating: 4.6
        },
        {
            id: 3,
            name: 'MetalRevive Inc',
            type: 'Metal Recycling',
            location: 'Delhi',
            contact: 'support@metalrevive.com',
            wasteProcessed: '200 tons',
            rating: 4.9
        }
    ]);

    const handleApproveRequest = (requestId: number) => {
        setCollectorRequests(prev => 
            prev.map(request => 
                request.id === requestId 
                    ? { ...request, status: 'approved' }
                    : request
            )
        );
        console.log(`Approved collector request: ${requestId}`);
    };

    const handleRejectRequest = (requestId: number) => {
        setCollectorRequests(prev => 
            prev.map(request => 
                request.id === requestId 
                    ? { ...request, status: 'rejected' }
                    : request
            )
        );
        console.log(`Rejected collector request: ${requestId}`);
    };

    const pendingRequests = collectorRequests.filter(req => req.status === 'pending');
    const approvedRequests = collectorRequests.filter(req => req.status === 'approved');
    const rejectedRequests = collectorRequests.filter(req => req.status === 'rejected');

    return (
        <div className="admin-dashboard">
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Admin Dashboard'}
                        {activeTab === 'management' && 'User Management'}
                        {activeTab === 'products' && 'Product Management'}
                        {activeTab === 'partners' && 'Recycling Partners'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Monitor platform activity and statistics'}
                        {activeTab === 'management' && 'Manage users, collectors, and platform settings'}
                        {activeTab === 'products' && 'Add and manage eco-store products'}
                        {activeTab === 'partners' && 'View and manage recycling partners'}
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
                                                            <strong>Vehicle:</strong>
                                                            <span>{request.vehicleType} ({request.vehicleNumber})</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <strong>Experience:</strong>
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
                                                            <strong>Vehicle:</strong>
                                                            <span>{request.vehicleType} ({request.vehicleNumber})</span>
                                                        </div>
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
                                                <strong>Location:</strong>
                                                <span>{partner.location}</span>
                                            </div>
                                            <div className="detail">
                                                <strong>Contact:</strong>
                                                <span>{partner.contact}</span>
                                            </div>
                                            <div className="detail">
                                                <strong>Waste Processed:</strong>
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
                                <button className="btn btn-success">
                                    <FaPlus /> Add New Partner
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
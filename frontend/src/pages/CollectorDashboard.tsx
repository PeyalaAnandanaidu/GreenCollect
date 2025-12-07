import { useState, useEffect } from 'react';
import './CollectorDashboard.css';
import DeliveryBuddy3D from '../components/DeliveryBuddy3D';
import { 
    FaTruck, FaCheckCircle, FaMapMarkerAlt, FaClock, 
    FaPhone, FaEnvelope, FaSearch, FaFilter, 
    FaCheck, FaTimes, FaExclamationTriangle, 
    FaSpinner, FaMoneyBillWave, FaCalendar,
    FaStar, FaEye
} from 'react-icons/fa';

interface CollectorDashboardProps {
    activeTab: string;
    collectorId?: string;
}

interface PickupRequest {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    pickupAddress: string;
    wasteType: string;
    estimatedWeight: number;
    pickupDate: string;
    pickupTime: string;
    status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    instructions?: string;
    coinsValue: number;
    createdAt: string;
    collectorId?: string;
}

const CollectorDashboard: React.FC<CollectorDashboardProps> = ({ activeTab, collectorId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        today: 0
    });

    // Fetch pickup requests from API
    useEffect(() => {
        fetchPickupRequests();
    }, [statusFilter]);

    // Calculate stats from pickup requests
    useEffect(() => {
        calculateStats();
    }, [pickupRequests]);

    const fetchPickupRequests = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            
            const queryString = params.toString();
            const url = `https://greencollect.onrender.com/api/waste-requests${queryString ? `?${queryString}` : ''}`;
            
            console.log('🔄 Fetching pickup requests from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Fetched requests:', data.length);
            setPickupRequests(data);
        } catch (err) {
            console.error('❌ Error fetching requests:', err);
            setError('Failed to load pickup requests. Please try again.');
            setPickupRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const today = new Date().toISOString().split('T')[0];
        const statsData = {
            total: pickupRequests.length,
            pending: pickupRequests.filter(r => r.status === 'pending').length,
            inProgress: pickupRequests.filter(r => r.status === 'in-progress').length,
            completed: pickupRequests.filter(r => r.status === 'completed').length,
            today: pickupRequests.filter(r => r.pickupDate === today).length
        };
        setStats(statsData);
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('🔄 Accepting request:', requestId);
            
            const response = await fetch(`https://greencollect.onrender.com/api/waste-requests/${requestId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📡 Accept response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Accept error:', errorData);
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to accept request`);
            }

            const result = await response.json();
            console.log('✅ Accept success:', result);
            
            if (result.success) {
                alert('✅ Request accepted successfully!');
                fetchPickupRequests();
            }
        } catch (err: any) {
            console.error('💥 Error accepting request:', err);
            alert(`Failed to accept request: ${err.message}`);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const response = await fetch(`https://greencollect.onrender.com/api/waste-requests/${requestId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject request');
            }

            const result = await response.json();
            if (result.success) {
                alert('Request rejected successfully!');
                fetchPickupRequests();
            }
        } catch (err: any) {
            console.error('Error rejecting request:', err);
            alert(`Failed to reject request: ${err.message}`);
        }
    };

    const handleStartPickup = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('🔄 Starting pickup for request:', requestId);
            
            const response = await fetch(`https://greencollect.onrender.com/api/waste-requests/${requestId}/start`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📡 Start pickup response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Start pickup error:', errorData);
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to start pickup`);
            }

            const result = await response.json();
            console.log('✅ Start pickup success:', result);
            
            if (result.success) {
                alert('🚚 Pickup started successfully!');
                fetchPickupRequests();
            }
        } catch (err: any) {
            console.error('💥 Error starting pickup:', err);
            alert(`Failed to start pickup: ${err.message}`);
        }
    };

    const handleCompletePickup = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const response = await fetch(`https://greencollect.onrender.com/api/waste-requests/${requestId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to complete pickup');
            }

            const result = await response.json();
            if (result.success) {
                alert(`✅ Pickup completed successfully! User earned ${result.coinsEarned} coins.`);
                fetchPickupRequests();
            }
        } catch (err: any) {
            console.error('Error completing pickup:', err);
            alert(`Failed to complete pickup: ${err.message}`);
        }
    };

    const filteredRequests = pickupRequests.filter(request => {
        const matchesSearch = 
            request.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FaClock className="status-icon pending" />;
            case 'accepted': return <FaCheck className="status-icon accepted" />;
            case 'in-progress': return <FaTruck className="status-icon in-progress" />;
            case 'completed': return <FaCheckCircle className="status-icon completed" />;
            case 'rejected': return <FaTimes className="status-icon rejected" />;
            case 'cancelled': return <FaTimes className="status-icon cancelled" />;
            default: return <FaClock className="status-icon" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'accepted': return 'Accepted';
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'rejected': return 'Rejected';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <FaExclamationTriangle className="priority-icon high" />;
            case 'medium': return <FaStar className="priority-icon medium" />;
            case 'low': return <FaStar className="priority-icon low" />;
            default: return <FaStar className="priority-icon" />;
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high': return 'High Priority';
            case 'medium': return 'Medium Priority';
            case 'low': return 'Low Priority';
            default: return priority;
        }
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading && pickupRequests.length === 0) {
        return (
            <div className="collector-dashboard">
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>Loading pickup requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="collector-dashboard">
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Collector Dashboard'}
                        {activeTab === 'requests' && 'Pickup Management'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Manage your pickup schedule and track performance'}
                        {activeTab === 'requests' && 'Accept, manage, and complete pickup requests'}
                    </p>
                </div>

                {error && (
                    <div className="error-banner">
                        <FaTimes />
                        <span>{error}</span>
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="collector-overview">
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-pickups">
                                    <FaTruck />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.today}</h3>
                                    <p>Today's Pickups</p>
                                    <span className="stat-trend positive">
                                        {stats.today > 0 ? 'Active schedule' : 'No pickups today'}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-pending">
                                    <FaClock />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending Requests</p>
                                    <span className="stat-trend">
                                        Awaiting your action
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-completed">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.completed}</h3>
                                    <p>Completed</p>
                                    <span className="stat-trend positive">
                                        Successful pickups
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-revenue">
                                    <FaMoneyBillWave />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.total}</h3>
                                    <p>Total Requests</p>
                                    <span className="stat-trend">
                                        All assignments
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Today's Pickup Requests */}
                        <div className="pending-requests">
                            <div className="section-header">
                                <h3>Today's Scheduled Pickups</h3>
                                <span className="badge">
                                    {pickupRequests.filter(request => request.pickupDate === today).length} requests
                                </span>
                            </div>
                            {pickupRequests
                                .filter(request => request.pickupDate === today)
                                .slice(0, 5)
                                .map(request => (
                                <div key={request._id} className="request-card">
                                    <div className="request-info">
                                        <FaMapMarkerAlt className="request-icon" />
                                        <div>
                                            <h4>{request.userId.name}</h4>
                                            <p>{request.pickupAddress}</p>
                                            <span className="request-meta">
                                                {request.wasteType} • {request.estimatedWeight} kg • {request.pickupTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <span className={`status-badge status-${request.status}`}>
                                            {getStatusIcon(request.status)}
                                            {getStatusText(request.status)}
                                        </span>
                                        {request.status === 'pending' && (
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAcceptRequest(request._id)}
                                            >
                                                <FaCheck /> Accept
                                            </button>
                                        )}
                                        {request.status === 'accepted' && (
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleStartPickup(request._id)}
                                            >
                                                <FaTruck /> Start
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {pickupRequests.filter(request => request.pickupDate === today).length === 0 && (
                                <div className="empty-state-small">
                                    <FaTruck className="empty-icon" />
                                    <p>No pickups scheduled for today</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="tab-content">
                        <div className="requests-management">
                            {/* Header Stats */}
                            <div className="management-header">
                                <div className="header-stats">
                                    <div className="header-stat">
                                        <span className="stat-number">{stats.total}</span>
                                        <span className="stat-label">Total</span>
                                    </div>
                                    <div className="header-stat">
                                        <span className="stat-number">{stats.pending}</span>
                                        <span className="stat-label">Pending</span>
                                    </div>
                                    <div className="header-stat">
                                        <span className="stat-number">{stats.inProgress}</span>
                                        <span className="stat-label">In Progress</span>
                                    </div>
                                    <div className="header-stat">
                                        <span className="stat-number">{stats.completed}</span>
                                        <span className="stat-label">Completed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="filters-section">
                                <div className="search-box">
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, address, or waste type..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <div className="filter">
                                        <FaFilter className="filter-icon" />
                                        <select 
                                            value={statusFilter} 
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="filter-select"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="filter">
                                        <FaExclamationTriangle className="filter-icon" />
                                        <select 
                                            value={priorityFilter} 
                                            onChange={(e) => setPriorityFilter(e.target.value)}
                                            className="filter-select"
                                        >
                                            <option value="all">All Priority</option>
                                            <option value="high">High Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="low">Low Priority</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Requests List */}
                            <div className="requests-list">
                                {filteredRequests.length === 0 ? (
                                    <div className="empty-state">
                                        <FaTruck className="empty-icon" />
                                        <h3>No pickup requests found</h3>
                                        <p>
                                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                                                ? 'Try adjusting your search filters'
                                                : 'No pickup requests available at the moment'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    filteredRequests.map((request, index) => (
                                        <div 
                                            key={request._id} 
                                            className={`pickup-request-card status-${request.status}`}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="request-header">
                                                <div className="user-info">
                                                    <h3>{request.userId.name}</h3>
                                                    <span className="user-id">ID: {request.userId._id.slice(-6)}</span>
                                                </div>
                                                <div className="request-meta">
                                                    <div className={`priority-badge priority-${request.priority}`}>
                                                        {getPriorityIcon(request.priority)}
                                                        {getPriorityText(request.priority)}
                                                    </div>
                                                    <div className={`status-badge status-${request.status}`}>
                                                        {getStatusIcon(request.status)}
                                                        {getStatusText(request.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="request-details">
                                                <div className="detail-row">
                                                    <div className="detail-item">
                                                        <FaMapMarkerAlt className="detail-icon" />
                                                        <div>
                                                            <span className="detail-label">Pickup Address</span>
                                                            <span className="detail-value">{request.pickupAddress}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <FaCalendar className="detail-icon" />
                                                        <div>
                                                            <span className="detail-label">Schedule</span>
                                                            <span className="detail-value">
                                                                {new Date(request.pickupDate).toLocaleDateString()} • {request.pickupTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <div className="detail-item">
                                                        <div className="waste-info">
                                                            <span className="waste-type">{request.wasteType}</span>
                                                            <span className="waste-weight">{request.estimatedWeight} kg</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <div className="coins-info">
                                                            <span className="coins-label">Reward Value</span>
                                                            <span className="coins-value">🪙 {request.coinsValue} coins</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <div className="detail-item">
                                                        <FaPhone className="detail-icon" />
                                                        <span>{request.userId.phone || 'Not provided'}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <FaEnvelope className="detail-icon" />
                                                        <span>{request.userId.email}</span>
                                                    </div>
                                                </div>

                                                {request.instructions && request.instructions !== 'None' && (
                                                    <div className="special-instructions">
                                                        <strong>Special Instructions:</strong>
                                                        <p>{request.instructions}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="request-actions">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-success"
                                                            onClick={() => handleAcceptRequest(request._id)}
                                                        >
                                                            <FaCheck /> Accept Request
                                                        </button>
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => handleRejectRequest(request._id)}
                                                        >
                                                            <FaTimes /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === 'accepted' && (
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleStartPickup(request._id)}
                                                    >
                                                        <FaTruck /> Start Pickup
                                                    </button>
                                                )}
                                                {request.status === 'in-progress' && (
                                                    <button 
                                                        className="btn btn-success"
                                                        onClick={() => handleCompletePickup(request._id)}
                                                    >
                                                        <FaCheckCircle /> Complete Pickup
                                                    </button>
                                                )}
                                                {(request.status === 'completed' || request.status === 'cancelled') && (
                                                    <button className="btn btn-outline">
                                                        <FaEye /> View Details
                                                    </button>
                                                )}
                                                <button className="btn btn-outline">
                                                    <FaPhone /> Contact User
                                                </button>
                                            </div>

                                            <div className="request-footer">
                                                <span className="created-at">
                                                    Request created: {new Date(request.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <section style={{ marginTop: "2rem" }}>
            <DeliveryBuddy3D />
        </section>
        </div>
    );
};

export default CollectorDashboard;
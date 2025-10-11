import { useState } from 'react';
import './CollectorDashboard.css';
import { 
    FaTruck, FaCheckCircle, FaMapMarkerAlt, FaClock, 
    FaUsers, FaCalendar, FaPhone, FaEnvelope, 
    FaSearch, FaFilter, FaCheck, FaTimes, FaEye,
    FaExclamationTriangle, FaStar
} from 'react-icons/fa';

interface CollectorDashboardProps {
    activeTab: string;
}

interface PickupRequest {
    id: number;
    userId: string;
    userName: string;
    userPhone: string;
    userEmail: string;
    address: string;
    type: string;
    weight: string;
    scheduledDate: string;
    scheduledTime: string;
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    specialInstructions?: string;
    estimatedDuration: string;
    coinsValue: number;
    createdAt: string;
}

const CollectorDashboard: React.FC<CollectorDashboardProps> = ({ activeTab }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    const pickupRequests: PickupRequest[] = [
        {
            id: 1,
            userId: 'USER001',
            userName: 'Rajesh Kumar',
            userPhone: '+91 9876543210',
            userEmail: 'rajesh@example.com',
            address: '123 MG Road, Bangalore, Karnataka - 560001',
            type: 'Plastic',
            weight: '5 kg',
            scheduledDate: '2024-01-20',
            scheduledTime: '2:00 PM - 4:00 PM',
            status: 'pending',
            priority: 'high',
            specialInstructions: 'Plastic bottles and containers only',
            estimatedDuration: '30 mins',
            coinsValue: 50,
            createdAt: '2024-01-19 10:30:00'
        },
        {
            id: 2,
            userId: 'USER002',
            userName: 'Priya Singh',
            userPhone: '+91 8765432109',
            userEmail: 'priya@example.com',
            address: '456 Koramangala, 3rd Block, Bangalore - 560034',
            type: 'Paper',
            weight: '3 kg',
            scheduledDate: '2024-01-20',
            scheduledTime: '10:00 AM - 12:00 PM',
            status: 'accepted',
            priority: 'medium',
            specialInstructions: 'Mixed paper waste, no cardboard',
            estimatedDuration: '20 mins',
            coinsValue: 30,
            createdAt: '2024-01-19 14:20:00'
        },
        {
            id: 3,
            userId: 'USER003',
            userName: 'Amit Sharma',
            userPhone: '+91 7654321098',
            userEmail: 'amit@example.com',
            address: '789 Whitefield, Bangalore - 560066',
            type: 'Electronics',
            weight: '2 kg',
            scheduledDate: '2024-01-21',
            scheduledTime: '3:00 PM - 5:00 PM',
            status: 'in-progress',
            priority: 'high',
            specialInstructions: 'Old mobile phones and chargers',
            estimatedDuration: '45 mins',
            coinsValue: 80,
            createdAt: '2024-01-18 09:15:00'
        },
        {
            id: 4,
            userId: 'USER004',
            userName: 'Sneha Patel',
            userPhone: '+91 6543210987',
            userEmail: 'sneha@example.com',
            address: '321 Indiranagar, Bangalore - 560038',
            type: 'Mixed',
            weight: '8 kg',
            scheduledDate: '2024-01-19',
            scheduledTime: '11:00 AM - 1:00 PM',
            status: 'completed',
            priority: 'low',
            specialInstructions: 'General household waste',
            estimatedDuration: '40 mins',
            coinsValue: 70,
            createdAt: '2024-01-18 16:45:00'
        },
        {
            id: 5,
            userId: 'USER005',
            userName: 'Rahul Verma',
            userPhone: '+91 5432109876',
            userEmail: 'rahul@example.com',
            address: '654 Jayanagar, Bangalore - 560041',
            type: 'Plastic',
            weight: '6 kg',
            scheduledDate: '2024-01-22',
            scheduledTime: '9:00 AM - 11:00 AM',
            status: 'pending',
            priority: 'medium',
            estimatedDuration: '35 mins',
            coinsValue: 60,
            createdAt: '2024-01-19 18:20:00'
        }
    ];

    const handleAcceptRequest = (requestId: number) => {
        console.log(`Accepted request: ${requestId}`);
        // API call to update status
    };

    const handleRejectRequest = (requestId: number) => {
        console.log(`Rejected request: ${requestId}`);
        // API call to update status
    };

    const handleStartPickup = (requestId: number) => {
        console.log(`Started pickup: ${requestId}`);
        // API call to update status
    };

    const handleCompletePickup = (requestId: number) => {
        console.log(`Completed pickup: ${requestId}`);
        // API call to update status
    };

    const filteredRequests = pickupRequests.filter(request => {
        const matchesSearch = 
            request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.type.toLowerCase().includes(searchTerm.toLowerCase());
        
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

    const stats = {
        total: pickupRequests.length,
        pending: pickupRequests.filter(r => r.status === 'pending').length,
        inProgress: pickupRequests.filter(r => r.status === 'in-progress').length,
        completed: pickupRequests.filter(r => r.status === 'completed').length,
        today: pickupRequests.filter(r => r.scheduledDate === '2024-01-20').length
    };

    return (
        <div className="collector-dashboard">
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Collector Dashboard'}
                        {activeTab === 'requests' && 'Manage Pickup Requests'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Manage your pickup requests and schedule'}
                        {activeTab === 'requests' && 'View and manage all pickup requests from users'}
                    </p>
                </div>

                {activeTab === 'overview' && (
                    <div className="collector-overview">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon-pickups">
                                    <FaTruck />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.today}</h3>
                                    <p>Today's Pickups</p>
                                    <span className="stat-trend positive">+2 from yesterday</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-pending">
                                    <FaClock />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending Requests</p>
                                    <span className="stat-trend negative">-3 from last week</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-completed">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.completed}</h3>
                                    <p>Completed This Week</p>
                                    <span className="stat-trend positive">+12% growth</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-revenue">
                                    <FaStar />
                                </div>
                                <div className="stat-content">
                                    <h3>₹2,450</h3>
                                    <p>Weekly Earnings</p>
                                    <span className="stat-trend positive">+8% growth</span>
                                </div>
                            </div>
                        </div>

                        <div className="pending-requests">
                            <div className="section-header">
                                <h3>Today's Pickup Requests</h3>
                                <span className="badge">{stats.today} requests</span>
                            </div>
                            {pickupRequests
                                .filter(request => request.scheduledDate === '2024-01-20')
                                .slice(0, 3)
                                .map(request => (
                                <div key={request.id} className="request-card">
                                    <div className="request-info">
                                        <FaMapMarkerAlt className="request-icon" />
                                        <div>
                                            <h4>{request.userName}</h4>
                                            <p>{request.address}</p>
                                            <span className="request-meta">
                                                {request.type} • {request.weight} • {request.scheduledTime}
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
                                                onClick={() => handleAcceptRequest(request.id)}
                                            >
                                                Accept
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                                        <span className="stat-label">Total Requests</span>
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
                                        placeholder="Search by name, address, or type..."
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
                                            <option value="cancelled">Cancelled</option>
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
                                        <h3>No requests found</h3>
                                        <p>No pickup requests match your search criteria</p>
                                    </div>
                                ) : (
                                    filteredRequests.map(request => (
                                        <div key={request.id} className="pickup-request-card">
                                            <div className="request-header">
                                                <div className="user-info">
                                                    <h3>{request.userName}</h3>
                                                    <span className="user-id">#{request.userId}</span>
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
                                                            <span className="detail-label">Address</span>
                                                            <span className="detail-value">{request.address}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <FaCalendar className="detail-icon" />
                                                        <div>
                                                            <span className="detail-label">Schedule</span>
                                                            <span className="detail-value">
                                                                {request.scheduledDate} • {request.scheduledTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <div className="detail-item">
                                                        <div className="waste-info">
                                                            <span className="waste-type">{request.type}</span>
                                                            <span className="waste-weight">{request.weight}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <div className="time-info">
                                                            <FaClock className="detail-icon" />
                                                            <span>{request.estimatedDuration}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <div className="coins-info">
                                                            <span className="coins-label">Coins Value</span>
                                                            <span className="coins-value">🪙 {request.coinsValue}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <div className="detail-item">
                                                        <FaPhone className="detail-icon" />
                                                        <span>{request.userPhone}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <FaEnvelope className="detail-icon" />
                                                        <span>{request.userEmail}</span>
                                                    </div>
                                                </div>

                                                {request.specialInstructions && (
                                                    <div className="special-instructions">
                                                        <strong>Special Instructions:</strong>
                                                        <p>{request.specialInstructions}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="request-actions">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-success"
                                                            onClick={() => handleAcceptRequest(request.id)}
                                                        >
                                                            <FaCheck /> Accept Request
                                                        </button>
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => handleRejectRequest(request.id)}
                                                        >
                                                            <FaTimes /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === 'accepted' && (
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleStartPickup(request.id)}
                                                    >
                                                        <FaTruck /> Start Pickup
                                                    </button>
                                                )}
                                                {request.status === 'in-progress' && (
                                                    <button 
                                                        className="btn btn-success"
                                                        onClick={() => handleCompletePickup(request.id)}
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
                                                    Request created: {request.createdAt}
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
        </div>
    );
};

export default CollectorDashboard;
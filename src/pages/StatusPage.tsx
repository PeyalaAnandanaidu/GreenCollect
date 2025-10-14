import { useEffect, useState } from 'react';
import './StatusPage.css';
import {
    FaCalendar,
    FaMapMarkerAlt,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaSearch,
    FaCoins,
    FaChartLine,
    FaSync,
    FaSpinner,
    FaUser,
    FaEnvelope
} from 'react-icons/fa';

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
    assignedCollector?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface StatusPageProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const StatusPage: React.FC<StatusPageProps> = ({ onTabChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [mounted, setMounted] = useState(false);
    const [pickups, setPickups] = useState<PickupRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    // Set active tab to 'status' when component mounts
    useEffect(() => {
        if (onTabChange) {
            onTabChange('status');
        }
    }, [onTabChange]);

    // Fetch user's pickup requests
    useEffect(() => {
        fetchUserPickups();
    }, []);

    const fetchUserPickups = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }

            console.log('🔄 Fetching user pickups from my-requests endpoint...');
            
            // Use the my-requests endpoint that doesn't require user ID
            const response = await fetch('https://greencollect.onrender.com/api/waste-requests/my-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Access denied. Please check your permissions.');
                }
                
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed to fetch requests: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Fetched requests:', data);
            
            if (data.success && data.requests) {
                setPickups(data.requests);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (err: any) {
            console.error('❌ Error fetching pickups:', err);
            setError(err.message || 'Failed to load your pickup requests. Please try again.');
            setPickups([]);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchUserPickups();
    };

    const statusStats = {
        total: pickups.length,
        completed: pickups.filter((p) => p.status === 'completed').length,
        inProgress: pickups.filter((p) => p.status === 'in-progress').length,
        pending: pickups.filter((p) => p.status === 'pending').length,
        accepted: pickups.filter((p) => p.status === 'accepted').length,
        rejected: pickups.filter((p) => p.status === 'rejected').length,
        cancelled: pickups.filter((p) => p.status === 'cancelled').length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <FaCheckCircle className="status-icon completed" />;
            case 'in-progress': return <FaTruck className="status-icon in-progress" />;
            case 'accepted': return <FaCheckCircle className="status-icon accepted" />;
            case 'pending': return <FaClock className="status-icon pending" />;
            case 'rejected': return <FaTimesCircle className="status-icon rejected" />;
            case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
            default: return <FaClock className="status-icon" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'accepted': return 'Accepted by Collector';
            case 'pending': return 'Pending Approval';
            case 'rejected': return 'Rejected';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'pending': return 'Waiting for a collector to accept your request';
            case 'accepted': return 'A collector has accepted your request and will arrive soon';
            case 'in-progress': return 'Collector is on the way to pickup your waste';
            case 'completed': return 'Pickup completed successfully';
            case 'rejected': return 'No collector was available for this request';
            case 'cancelled': return 'This pickup was cancelled';
            default: return 'Status update pending';
        }
    };

    const getProgressPercentage = (status: string) => {
        switch (status) {
            case 'pending': return 25;
            case 'accepted': return 50;
            case 'in-progress': return 75;
            case 'completed': return 100;
            case 'rejected': return 0;
            case 'cancelled': return 0;
            default: return 0;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredPickups = pickups.filter((pickup) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
            pickup.wasteType.toLowerCase().includes(term) || 
            pickup.pickupAddress.toLowerCase().includes(term) ||
            pickup._id.toLowerCase().includes(term);
        const matchesFilter = statusFilter === 'all' || pickup.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    // Auto-refresh data every 30 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                fetchUserPickups();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [loading]);

    if (loading) {
        return (
            <div className="status-page">
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>Loading your pickup requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="status-page">
            <div className="container">
                <div className={`status-header ${mounted ? 'animate-in' : ''}`}>
                    <div className="header-content">
                        <h1 className="page-title">My Pickup Requests</h1>
                        <p className="page-subtitle">Track your waste pickup orders and view their current status in real-time</p>
                    </div>
                    <div className="header-actions">
                        
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <FaTimesCircle />
                        <span>{error}</span>
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className={`status-stats ${mounted ? 'animate-in delay-1' : ''}`}>
                    <div className="stat-card total">
                        <div className="stat-number">{statusStats.total}</div>
                        <div className="stat-label">Total Requests</div>
                    </div>
                    <div className="stat-card completed">
                        <div className="stat-number">{statusStats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card active">
                        <div className="stat-number">{statusStats.inProgress + statusStats.accepted}</div>
                        <div className="stat-label">Active</div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-number">{statusStats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card rejected">
                        <div className="stat-number">{statusStats.rejected + statusStats.cancelled}</div>
                        <div className="stat-label">Not Fulfilled</div>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className={`controls-section ${mounted ? 'animate-in delay-2' : ''}`}>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search by waste type, address, or request ID..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Filter by Status</span>
                        <div className="filter-container">
                            <select 
                                className="filter-select" 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pickup Requests List */}
                <div className={`pickups-container ${mounted ? 'animate-in delay-3' : ''}`}>
                    {filteredPickups.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🚛</div>
                            <h3>No pickup requests found</h3>
                            <p>
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'No requests match your search criteria. Try changing your filters.' 
                                    : 'You haven\'t scheduled any pickup requests yet. Schedule your first pickup to get started!'
                                }
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                                <button className="btn btn-primary" onClick={() => window.location.href = '/schedule'}>
                                    Schedule First Pickup
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredPickups.map((pickup) => (
                            <div key={pickup._id} className={`pickup-card status-${pickup.status}`}>
                                <div className="pickup-header">
                                    <div className="pickup-info">
                                        <h3 className="pickup-type">{pickup.wasteType} Collection</h3>
                                        <span className="tracking-number">Request ID: {pickup._id.slice(-8)}</span>
                                    </div>
                                    <div className={`status-badge status-${pickup.status}`}>
                                        {getStatusIcon(pickup.status)}
                                        {getStatusText(pickup.status)}
                                    </div>
                                </div>

                                <div className="status-description">
                                    {getStatusDescription(pickup.status)}
                                </div>

                                <div className="pickup-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <FaCalendar className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Pickup Date & Time</span>
                                                <span className="detail-value">
                                                    {formatDate(pickup.pickupDate)} • {pickup.pickupTime}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="weight-badge">
                                                <span className="detail-label">Estimated Weight</span>
                                                <span className="detail-value">{pickup.estimatedWeight} kg</span>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="coins-badge">
                                                <FaCoins className="coins-icon" />
                                                <span className="detail-value">+{pickup.coinsValue} coins</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <FaMapMarkerAlt className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Pickup Address</span>
                                                <span className="detail-value">{pickup.pickupAddress}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {pickup.assignedCollector && (
                                        <div className="detail-row collector-info">
                                            <div className="detail-item">
                                                <FaUser className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Assigned Collector</span>
                                                    <span className="detail-value collector-name">{pickup.assignedCollector.name}</span>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <FaEnvelope className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Collector Email</span>
                                                    <span className="detail-value">{pickup.assignedCollector.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {pickup.instructions && pickup.instructions !== 'None' && (
                                        <div className="detail-row">
                                            <div className="detail-item full-width">
                                                <div className="special-instructions">
                                                    <strong>Special Instructions:</strong>
                                                    <p>{pickup.instructions}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <FaClock className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Request Created</span>
                                                <span className="detail-value">
                                                    {new Date(pickup.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar - Only show for active requests */}
                                {!['rejected', 'cancelled', 'completed'].includes(pickup.status) && (
                                    <div className="progress-section">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${getProgressPercentage(pickup.status)}%` }}
                                            ></div>
                                        </div>
                                        <div className="progress-labels">
                                            <span className={['pending', 'accepted', 'in-progress', 'completed'].includes(pickup.status) ? 'active' : ''}>
                                                Pending
                                            </span>
                                            <span className={['accepted', 'in-progress', 'completed'].includes(pickup.status) ? 'active' : ''}>
                                                Accepted
                                            </span>
                                            <span className={['in-progress', 'completed'].includes(pickup.status) ? 'active' : ''}>
                                                In Progress
                                            </span>
                                            <span className={pickup.status === 'completed' ? 'active' : ''}>
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    {pickup.status === 'pending' && (
                                        <>
                                            <button className="btn btn-secondary">Edit Request</button>
                                            <button className="btn btn-danger">Cancel Request</button>
                                        </>
                                    )}
                                    {pickup.status === 'accepted' && (
                                        <button className="btn btn-primary">Contact Collector</button>
                                    )}
                                    {pickup.status === 'in-progress' && (
                                        <button className="btn btn-primary">Track Live Location</button>
                                    )}
                                    {pickup.status === 'completed' && (
                                        <button className="btn btn-secondary">View Receipt</button>
                                    )}
                                    {(pickup.status === 'rejected' || pickup.status === 'cancelled') && (
                                        <button className="btn btn-primary">Reschedule</button>
                                    )}
                                    <button className="btn btn-outline">Get Help</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
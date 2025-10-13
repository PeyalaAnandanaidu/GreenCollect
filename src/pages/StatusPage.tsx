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
    FaDownload,
    FaPrint,
} from 'react-icons/fa';

interface Pickup {
    id: number;
    date: string;
    type: string;
    weight: string;
    address: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    collector?: string;
    estimatedTime?: string;
    trackingNumber: string;
    coinsEarned?: number;
    efficiency?: number;
}

interface StatusPageProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const StatusPage: React.FC<StatusPageProps> = ({ onTabChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [mounted, setMounted] = useState(false);

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

    const pickups: Pickup[] = [
        { id: 1, date: '2025-10-05', type: 'Plastic', weight: '5 kg', address: '123 Main St, City', status: 'completed', collector: 'John Doe', trackingNumber: 'JG-2025-001', coinsEarned: 50, efficiency: 95 },
        { id: 2, date: '2025-10-06', type: 'Paper', weight: '3 kg', address: '456 Oak Ave, Town', status: 'in-progress', collector: 'Jane Smith', estimatedTime: '30-45 mins', trackingNumber: 'JG-2025-002', coinsEarned: 30, efficiency: 87 },
        { id: 3, date: '2025-10-07', type: 'Electronics', weight: '2 kg', address: '789 Pine Rd, Village', status: 'scheduled', estimatedTime: 'Tomorrow, 2:00 PM', trackingNumber: 'JG-2025-003', coinsEarned: 40, efficiency: 92 },
    ];

    const statusStats = {
        total: pickups.length,
        completed: pickups.filter((p) => p.status === 'completed').length,
        inProgress: pickups.filter((p) => p.status === 'in-progress').length,
        scheduled: pickups.filter((p) => p.status === 'scheduled').length,
    };

    const getStatusIcon = (status: Pickup['status']) => {
        switch (status) {
            case 'completed': return <FaCheckCircle className="status-icon completed" />;
            case 'in-progress': return <FaTruck className="status-icon in-progress" />;
            case 'scheduled': return <FaClock className="status-icon scheduled" />;
            case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
            default: return <FaClock className="status-icon" />;
        }
    };

    const getStatusText = (status: Pickup['status']) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'scheduled': return 'Scheduled';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const filteredPickups = pickups.filter((pickup) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = pickup.trackingNumber.toLowerCase().includes(term) || pickup.type.toLowerCase().includes(term) || pickup.address.toLowerCase().includes(term);
        const matchesFilter = statusFilter === 'all' || pickup.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="status-page">
            <div className="container">
                <div className={`status-header ${mounted ? 'animate-in' : ''}`}>
                    <div className="header-content">
                        {/* Removed Back to Dashboard button */}
                        <h1 className="page-title">Pickup Status & Tracking</h1>
                        <p className="page-subtitle">Track your waste pickup orders and view their current status in real-time</p>
                    </div>
                </div>

                <div className={`status-stats ${mounted ? 'animate-in delay-1' : ''}`}>
                    <div className="stat-card"><div className="stat-number">{statusStats.total}</div><div className="stat-label">Total Pickups</div></div>
                    <div className="stat-card"><div className="stat-number">{statusStats.completed}</div><div className="stat-label">Completed</div></div>
                    <div className="stat-card"><div className="stat-number">{statusStats.inProgress}</div><div className="stat-label">In Progress</div></div>
                    <div className="stat-card"><div className="stat-number">{statusStats.scheduled}</div><div className="stat-label">Scheduled</div></div>
                </div>

                <div className={`quick-actions ${mounted ? 'animate-in delay-2' : ''}`}>
                    <button className="quick-action-btn"><FaSync /> Refresh Status</button>
                    <button className="quick-action-btn"><FaDownload /> Export Data</button>
                    <button className="quick-action-btn"><FaPrint /> Print Report</button>
                    <button className="quick-action-btn"><FaChartLine /> View Analytics</button>
                </div>

                <div className={`controls-section ${mounted ? 'animate-in delay-3' : ''}`}>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input type="text" className="search-input" placeholder="Search by tracking number, type, or address..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Filter by Status</span>
                        <div className="filter-container">
                            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={`pickups-container ${mounted ? 'animate-in delay-4' : ''}`}>
                    {filteredPickups.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🚛</div>
                            <h3>No pickups found</h3>
                            <p>No pickups match your search criteria</p>
                        </div>
                    ) : (
                        filteredPickups.map((pickup) => (
                            <div key={pickup.id} className="pickup-card">
                                <div className="pickup-header">
                                    <div className="pickup-info">
                                        <h3 className="pickup-type">{pickup.type} Collection</h3>
                                        <span className="tracking-number">#{pickup.trackingNumber}</span>
                                    </div>
                                    <div className={`status-badge status-${pickup.status}`}>
                                        {getStatusIcon(pickup.status)}
                                        {getStatusText(pickup.status)}
                                    </div>
                                </div>

                                <div className="pickup-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <FaCalendar className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Pickup Date</span>
                                                <span className="detail-value">{pickup.date}</span>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="weight-badge">
                                                <span className="detail-label">Weight</span>
                                                <span className="detail-value">{pickup.weight}</span>
                                            </div>
                                        </div>
                                        {pickup.coinsEarned && (
                                            <div className="detail-item">
                                                <div className="coins-badge"><FaCoins className="coins-icon" /><span className="detail-value">+{pickup.coinsEarned}</span></div>
                                            </div>
                                        )}
                                        {pickup.efficiency && (
                                            <div className="detail-item">
                                                <div className="efficiency-display"><span className="detail-label">Efficiency</span><span className="detail-value">{pickup.efficiency}%</span></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <FaMapMarkerAlt className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Address</span>
                                                <span className="detail-value">{pickup.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {pickup.collector && (
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <FaTruck className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Collector</span>
                                                    <span className="detail-value">{pickup.collector}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {pickup.estimatedTime && (
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <FaClock className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">{pickup.status === 'in-progress' ? 'Estimated Arrival' : 'Scheduled Time'}</span>
                                                    <span className="detail-value">{pickup.estimatedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {pickup.status === 'in-progress' && (
                                    <div className="progress-section">
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: '60%' }}></div></div>
                                        <div className="progress-labels"><span>Scheduled</span><span className="active">In Progress</span><span>Completed</span></div>
                                    </div>
                                )}

                                <div className="action-buttons">
                                    {pickup.status === 'scheduled' && (<><button className="btn btn-yellow">Reschedule</button><button className="btn btn-blue">Cancel</button></>)}
                                    {pickup.status === 'in-progress' && (<button className="btn btn-yellow">Track Live</button>)}
                                    {pickup.status === 'completed' && (<button className="btn btn-yellow">View Details</button>)}
                                    <button className="btn btn-outline">Contact Support</button>
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
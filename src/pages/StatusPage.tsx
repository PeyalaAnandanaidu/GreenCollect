import { useState } from 'react';
import './StatusPage.css';
import {
    FaCalendar,
    FaMapMarkerAlt,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaSearch,
    FaFilter,
    FaChevronLeft
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
}

const StatusPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const pickups: Pickup[] = [
        {
            id: 1,
            date: '2025-10-05',
            type: 'Plastic',
            weight: '5 kg',
            address: '123 Main St, City',
            status: 'completed',
            collector: 'John Doe',
            trackingNumber: 'GC-2025-001'
        },
        {
            id: 2,
            date: '2025-10-06',
            type: 'Paper',
            weight: '3 kg',
            address: '456 Oak Ave, Town',
            status: 'in-progress',
            collector: 'Jane Smith',
            estimatedTime: '30-45 mins',
            trackingNumber: 'GC-2025-002'
        },
        {
            id: 3,
            date: '2025-10-07',
            type: 'Electronics',
            weight: '2 kg',
            address: '789 Pine Rd, Village',
            status: 'scheduled',
            estimatedTime: 'Tomorrow, 2:00 PM',
            trackingNumber: 'GC-2025-003'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="status-icon completed" />;
            case 'in-progress':
                return <FaTruck className="status-icon in-progress" />;
            case 'scheduled':
                return <FaClock className="status-icon scheduled" />;
            case 'cancelled':
                return <FaTimesCircle className="status-icon cancelled" />;
            default:
                return <FaClock className="status-icon" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in-progress':
                return 'In Progress';
            case 'scheduled':
                return 'Scheduled';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const filteredPickups = pickups.filter(pickup => {
        const matchesSearch = pickup.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pickup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pickup.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || pickup.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="status-page">
            {/* Header */}
            <div className="status-header">
                <div className="header-content">
                    <button className="back-button" onClick={() => window.history.back()}>
                        <FaChevronLeft />
                        Back to Dashboard
                    </button>
                    <h1 className="page-title">Pickup Status & Tracking</h1>
                    <p className="page-subtitle">Track your waste pickup orders and view their current status</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="controls-section">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by tracking number, type, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-container">
                    <FaFilter className="filter-icon" />
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Pickups List */}
            <div className="pickups-container">
                {filteredPickups.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
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
                                                <span className="detail-label">
                                                    {pickup.status === 'in-progress' ? 'Estimated Arrival' : 'Scheduled Time'}
                                                </span>
                                                <span className="detail-value">{pickup.estimatedTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar for In Progress status */}
                            {pickup.status === 'in-progress' && (
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '60%' }}></div>
                                    </div>
                                    <div className="progress-labels">
                                        <span>Scheduled</span>
                                        <span className="active">In Progress</span>
                                        <span>Completed</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="action-buttons">
                                {pickup.status === 'scheduled' && (
                                    <>
                                        <button className="btn btn-primary">Reschedule</button>
                                        <button className="btn btn-secondary">Cancel</button>
                                    </>
                                )}
                                {pickup.status === 'in-progress' && (
                                    <button className="btn btn-primary">Track Live</button>
                                )}
                                {pickup.status === 'completed' && (
                                    <button className="btn btn-primary">View Details</button>
                                )}
                                <button className="btn btn-outline">Contact Support</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StatusPage;
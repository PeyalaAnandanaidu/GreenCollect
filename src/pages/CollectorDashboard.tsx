import './CollectorDashboard.css';
import { FaTruck, FaCheckCircle, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';

interface CollectorDashboardProps {
    activeTab: string;
}

const CollectorDashboard: React.FC<CollectorDashboardProps> = ({ activeTab }) => {
    const pendingRequests = [
        { id: 1, address: '123 Main St', type: 'Plastic', weight: '5 kg', time: '2:00 PM' },
        { id: 2, address: '456 Oak Ave', type: 'Paper', weight: '3 kg', time: '3:30 PM' },
    ];

    return (
        <div className="collector-dashboard">
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Collector Dashboard'}
                        {activeTab === 'requests' && 'Manage Requests'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Manage your pickup requests and schedule'}
                        {activeTab === 'requests' && 'View and manage pickup requests from users'}
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
                                    <h3>8</h3>
                                    <p>Today's Pickups</p>
                                    <span className="stat-trend positive">+2 from yesterday</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon stat-icon-completed">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>45</h3>
                                    <p>Completed This Week</p>
                                    <span className="stat-trend positive">+12% growth</span>
                                </div>
                            </div>
                        </div>

                        <div className="pending-requests">
                            <h3>Pending Requests</h3>
                            {pendingRequests.map(request => (
                                <div key={request.id} className="request-card">
                                    <div className="request-info">
                                        <FaMapMarkerAlt className="request-icon" />
                                        <div>
                                            <h4>{request.address}</h4>
                                            <p>{request.type} • {request.weight}</p>
                                        </div>
                                    </div>
                                    <div className="request-time">
                                        <FaClock />
                                        <span>{request.time}</span>
                                    </div>
                                    <button className="btn btn-primary">Accept</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="tab-content">
                        <div className="content-card">
                            <div className="card-header">
                                <FaTruck className="card-header-icon" />
                                <h2>Manage Requests</h2>
                            </div>
                            <p>View pending pickup requests and mark as completed.</p>
                            <div className="request-stats">
                                <div className="request-stat">
                                    <span className="stat-number">12</span>
                                    <span className="stat-label">Pending Requests</span>
                                </div>
                                <div className="request-stat">
                                    <span className="stat-number">8</span>
                                    <span className="stat-label">Completed Today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollectorDashboard;
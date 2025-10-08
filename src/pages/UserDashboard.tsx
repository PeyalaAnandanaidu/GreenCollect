import { useState } from 'react';
import './UserDashboard.css';
import {
    FaTrash, FaTruck, FaCheckCircle, FaUsers,
    FaCalendar, FaMapMarkerAlt, FaChevronRight, FaSearch,
    FaListAlt, FaRecycle, FaClock, FaCheck,
    FaTimesCircle, FaTruck as FaTruckIcon
} from 'react-icons/fa';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import SchedulePickup from './SchedulePickup';
import SustainableProducts from './SustainableProducts';

interface UserDashboardProps {
    activeTab: string;
}

// Sample Data
const monthlyData = [
    { month: 'Jan', Waste: 30, Coins: 50, Target: 65 },
    { month: 'Feb', Waste: 45, Coins: 75, Target: 65 },
    { month: 'Mar', Waste: 60, Coins: 100, Target: 65 },
    { month: 'Apr', Waste: 70, Coins: 120, Target: 65 },
    { month: 'May', Waste: 65, Coins: 110, Target: 65 },
    { month: 'Jun', Waste: 80, Coins: 140, Target: 65 },
];

const wasteTypesData = [
    { name: 'Plastic', value: 40, color: '#28a745' },
    { name: 'Paper', value: 25, color: '#20c997' },
    { name: 'Electronics', value: 20, color: '#ffc107' },
];

const recentPickups = [
    { id: 1, date: '2025-10-05', type: 'Plastic', weight: '5 kg', status: 'Completed', address: '123 Main St' },
    { id: 2, date: '2025-10-04', type: 'Paper', weight: '3 kg', status: 'Pending', address: '456 Oak Ave' },
    { id: 3, date: '2025-10-03', type: 'Electronics', weight: '2 kg', status: 'Completed', address: '789 Pine Rd' },
];

const statusPickups = [
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
    },
];

const UserDashboard: React.FC<UserDashboardProps> = ({ activeTab }) => {
    const [showSchedulePickup, setShowSchedulePickup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const statusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Pending': return 'status-pending';
            case 'In Progress': return 'status-progress';
            default: return 'status-default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FaCheck className="status-icon completed" />;
            case 'in-progress':
                return <FaTruckIcon className="status-icon in-progress" />;
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

    const filteredPickups = statusPickups.filter(pickup => {
        const matchesSearch = pickup.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pickup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pickup.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || pickup.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    // Stats Cards Component
    const StatsCards = () => (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon stat-icon-waste">
                    <FaTrash />
                </div>
                <div className="stat-content">
                    <h3>120 kg</h3>
                    <p>Waste Collected</p>
                    <span className="stat-trend positive">+12% this month</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stat-icon-pickups">
                    <FaTruck />
                </div>
                <div className="stat-content">
                    <h3>45</h3>
                    <p>Total Pickups</p>
                    <span className="stat-trend positive">+15% growth</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stat-icon-pending">
                    <FaCheckCircle />
                </div>
                <div className="stat-content">
                    <h3>8</h3>
                    <p>Pending Pickups</p>
                    <span className="stat-trend negative">-2 from last week</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon stat-icon-users">
                    <FaUsers />
                </div>
                <div className="stat-content">
                    <h3>1,240</h3>
                    <p>Eco Coins</p>
                    <span className="stat-trend positive">+150 this month</span>
                </div>
            </div>
        </div>
    );

    // Charts Component
    const Charts = () => (
        <div className="charts-grid">
            <div className="chart-card">
                <div className="chart-header">
                    <h3>Monthly Progress</h3>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <div className="legend-color waste-color"></div>
                            <span>Waste (kg)</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color coins-color"></div>
                            <span>Coins</span>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                        <defs>
                            <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#28a745" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#28a745" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="coinsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffc107" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ffc107" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Waste" stroke="#28a745" fillOpacity={1} fill="url(#wasteGradient)" />
                        <Area type="monotone" dataKey="Coins" stroke="#ffc107" fillOpacity={1} fill="url(#coinsGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <div className="chart-header">
                    <h3>Waste Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={wasteTypesData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                        >
                            {wasteTypesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Recent Activity Component
    const RecentActivity = () => (
        <div className="activity-card">
            <div className="activity-header">
                <h3>Recent Pickups</h3>
                <button className="view-all-btn">
                    View All <FaChevronRight className="ml-2" />
                </button>
            </div>
            <div className="activity-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Weight</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPickups.map((pickup) => (
                            <tr key={pickup.id}>
                                <td>
                                    <div className="date-cell">
                                        <FaCalendar className="text-muted mr-2" />
                                        {pickup.date}
                                    </div>
                                </td>
                                <td>
                                    <div className="type-badge" style={{
                                        backgroundColor: wasteTypesData.find(w => w.name === pickup.type)?.color + '20',
                                        color: wasteTypesData.find(w => w.name === pickup.type)?.color
                                    }}>
                                        {pickup.type}
                                    </div>
                                </td>
                                <td className="font-semibold">{pickup.weight}</td>
                                <td>
                                    <div className="location-cell">
                                        <FaMapMarkerAlt className="text-muted mr-2" />
                                        {pickup.address}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${statusColor(pickup.status)}`}>
                                        {pickup.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Status Tracking Component
    const StatusTracking = () => (
        <div className="tab-content">
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
                    <FaListAlt className="filter-icon" />
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
                                            <FaTruckIcon className="detail-icon" />
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

    return (
        <div className="user-dashboard">
            {/* Schedule Pickup Modal */}
            {showSchedulePickup && (
                <SchedulePickup onClose={() => setShowSchedulePickup(false)} />
            )}

            {/* Main Content */}
            <main className="main-content">
                {/* Page Title */}
                <div className="page-header">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'bookings' && 'Book Pickups'}
                        {activeTab === 'status' && 'Pickup Status & Tracking'}
                        {activeTab === 'products' && 'Eco Store'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Track your waste management progress and earnings'}
                        {activeTab === 'bookings' && 'Schedule new waste pickups and manage existing bookings'}
                        {activeTab === 'status' && 'Track your waste pickup orders and view their current status'}
                        {activeTab === 'products' && 'Redeem your earned coins for eco-friendly products'}
                    </p>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <StatsCards />
                        <Charts />
                        <RecentActivity />
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="tab-content">
                        <div className="booking-main-section">
                            <div className="booking-card">
                                <div className="booking-card-header">
                                    <FaRecycle className="booking-card-icon" />
                                    <h2>Schedule a Pickup</h2>
                                </div>

                                <div className="booking-card-content">
                                    <p className="booking-description">
                                        Book a waste collection pickup by selecting the date, waste type, and pickup location.
                                        Our collector will come to your specified address at the scheduled time.
                                    </p>

                                    <div className="booking-action-section">
                                        <div
                                            className="booking-main-option"
                                            onClick={() => setShowSchedulePickup(true)}
                                        >
                                            <div className="booking-main-icon">
                                                <FaCalendar />
                                            </div>
                                            <div className="booking-main-content">
                                                <h3>Book New Pickup</h3>
                                                <p>Schedule a waste collection at your preferred time and location</p>
                                            </div>
                                            <FaChevronRight className="booking-arrow" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Tab */}
                {activeTab === 'status' && (
                    <StatusTracking />
                )}

                {/* Sustainable Products Tab */}
                {activeTab === 'products' && (
                    <SustainableProducts />
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
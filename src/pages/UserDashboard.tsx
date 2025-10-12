import { useState } from 'react';
import './UserDashboard.css';
import {
    FaTrash, FaTruck, FaCheckCircle, FaUsers,
    FaCalendar, FaMapMarkerAlt, FaChevronRight, FaSearch,
    FaListAlt, FaRecycle, FaClock, FaCheck,
    FaTimesCircle, FaTruck as FaTruckIcon,
    FaTools, FaLeaf, FaCoins, FaChartLine,
    FaBolt, FaShieldAlt, FaRocket, FaStar
} from 'react-icons/fa';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area, BarChart, Bar
} from 'recharts';
import SchedulePickup from './SchedulePickup';
import SustainableProducts from './SustainableProducts';

interface UserDashboardProps {
    activeTab: string;
}

// Sample Data with updated colors
const monthlyData = [
    { month: 'Jan', Waste: 30, Coins: 50, Target: 65 },
    { month: 'Feb', Waste: 45, Coins: 75, Target: 65 },
    { month: 'Mar', Waste: 60, Coins: 100, Target: 65 },
    { month: 'Apr', Waste: 70, Coins: 120, Target: 65 },
    { month: 'May', Waste: 65, Coins: 110, Target: 65 },
    { month: 'Jun', Waste: 80, Coins: 140, Target: 65 },
];

const wasteTypesData = [
    { name: 'Plastic', value: 40, color: '#ffcc00' },
    { name: 'Paper', value: 25, color: '#00ffff' },
    { name: 'Electronics', value: 20, color: '#ffaa00' },
    { name: 'Metal', value: 15, color: '#00ccff' },
];

const efficiencyData = [
    { category: 'Collection', efficiency: 85, target: 90 },
    { category: 'Sorting', efficiency: 78, target: 85 },
    { category: 'Processing', efficiency: 92, target: 88 },
    { category: 'Recycling', efficiency: 88, target: 90 },
];

const recentPickups = [
    { id: 1, date: '2025-10-05', type: 'Plastic', weight: '5 kg', status: 'Completed', address: '123 Main St', efficiency: 95 },
    { id: 2, date: '2025-10-04', type: 'Paper', weight: '3 kg', status: 'Pending', address: '456 Oak Ave', efficiency: 87 },
    { id: 3, date: '2025-10-03', type: 'Electronics', weight: '2 kg', status: 'Completed', address: '789 Pine Rd', efficiency: 92 },
];

const statusPickups = [
    {
        id: 1,
        date: '2025-10-05',
        type: 'Plastic',
        weight: '5 kg',
        address: '123 Main St, City',
        status: 'completed',
        collector: 'Rajesh Kumar',
        trackingNumber: 'JG-2025-001',
        coinsEarned: 50,
        efficiency: 95
    },
    {
        id: 2,
        date: '2025-10-06',
        type: 'Paper',
        weight: '3 kg',
        address: '456 Oak Ave, Town',
        status: 'in-progress',
        collector: 'Priya Sharma',
        estimatedTime: '30-45 mins',
        trackingNumber: 'JG-2025-002',
        coinsEarned: 30,
        efficiency: 87
    },
    {
        id: 3,
        date: '2025-10-07',
        type: 'Electronics',
        weight: '2 kg',
        address: '789 Pine Rd, Village',
        status: 'scheduled',
        estimatedTime: 'Tomorrow, 2:00 PM',
        trackingNumber: 'JG-2025-003',
        coinsEarned: 40,
        efficiency: 92
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
            <div className="stat-card stat-card-yellow">
                <div className="stat-icon">
                    <FaTrash />
                </div>
                <div className="stat-content">
                    <h3>120 kg</h3>
                    <p>Waste Recycled</p>
                    <span className="stat-trend positive">+12% this month</span>
                </div>
                <div className="stat-glow"></div>
                <FaBolt className="stat-corner-icon" />
            </div>

            <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                    <FaTruck />
                </div>
                <div className="stat-content">
                    <h3>45</h3>
                    <p>Total Pickups</p>
                    <span className="stat-trend positive">+15% growth</span>
                </div>
                <div className="stat-glow"></div>
                <FaRocket className="stat-corner-icon" />
            </div>

            <div className="stat-card stat-card-yellow">
                <div className="stat-icon">
                    <FaCheckCircle />
                </div>
                <div className="stat-content">
                    <h3>8</h3>
                    <p>Active Requests</p>
                    <span className="stat-trend negative">-2 from last week</span>
                </div>
                <div className="stat-glow"></div>
                <FaShieldAlt className="stat-corner-icon" />
            </div>

            <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                    <FaCoins />
                </div>
                <div className="stat-content">
                    <h3>1,240</h3>
                    <p>Eco Coins</p>
                    <span className="stat-trend positive">+150 this month</span>
                </div>
                <div className="stat-glow"></div>
                <FaStar className="stat-corner-icon" />
            </div>
        </div>
    );

    // Charts Component
    const Charts = () => (
        <div className="charts-grid">
            <div className="chart-card">
                <div className="chart-header">
                    <h3>
                        <FaChartLine className="chart-title-icon" />
                        Monthly Progress
                    </h3>
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
                                <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ffcc00" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="coinsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ffff" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#00ffff" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#ffcc00" />
                        <YAxis axisLine={false} tickLine={false} stroke="#00ffff" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0a0a0a', 
                                border: '1px solid #00ffff',
                                borderRadius: '8px',
                                color: '#ffffff',
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                            }}
                        />
                        <Area type="monotone" dataKey="Waste" stroke="#ffcc00" fillOpacity={1} fill="url(#wasteGradient)" strokeWidth={2} />
                        <Area type="monotone" dataKey="Coins" stroke="#00ffff" fillOpacity={1} fill="url(#coinsGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <div className="chart-header">
                    <h3>
                        <FaLeaf className="chart-title-icon" />
                        Waste Distribution
                    </h3>
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
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0a0a0a', 
                                border: '1px solid #ffcc00',
                                borderRadius: '8px',
                                color: '#ffffff',
                                boxShadow: '0 0 20px rgba(255, 204, 0, 0.3)'
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card full-width">
                <div className="chart-header">
                    <h3>
                        <FaBolt className="chart-title-icon" />
                        Process Efficiency
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                        <XAxis dataKey="category" axisLine={false} tickLine={false} stroke="#00ffff" />
                        <YAxis axisLine={false} tickLine={false} stroke="#ffcc00" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0a0a0a', 
                                border: '1px solid #00ffff',
                                borderRadius: '8px',
                                color: '#ffffff',
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                            }}
                        />
                        <Bar dataKey="efficiency" fill="#00ffff" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" fill="#ffcc00" radius={[4, 4, 0, 0]} opacity={0.7} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Recent Activity Component
    const RecentActivity = () => (
        <div className="activity-card">
            <div className="activity-header">
                <h3>
                    <FaListAlt className="activity-icon" />
                    Recent Pickups
                </h3>
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
                            <th>Coins</th>
                            <th>Efficiency</th>
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
                                        color: wasteTypesData.find(w => w.name === pickup.type)?.color,
                                        border: `1px solid ${wasteTypesData.find(w => w.name === pickup.type)?.color}`
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
                                <td>
                                    <div className="coins-earned">
                                        <FaCoins className="coins-icon" />
                                        +{Number(pickup.weight.split(' ')[0]) * 10}
                                    </div>
                                </td>
                                <td>
                                    <div className="efficiency-badge" style={{
                                        color: pickup.efficiency > 90 ? '#00ffff' : pickup.efficiency > 80 ? '#ffcc00' : '#ff4444'
                                    }}>
                                        {pickup.efficiency}%
                                    </div>
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
                                    <div className="detail-item">
                                        <div className="coins-badge">
                                            <FaCoins className="coins-icon" />
                                            <span className="detail-value">+{pickup.coinsEarned}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="efficiency-display">
                                            <span className="detail-label">Efficiency</span>
                                            <span className="detail-value" style={{
                                                color: pickup.efficiency > 90 ? '#00ffff' : '#ffcc00'
                                            }}>
                                                {pickup.efficiency}%
                                            </span>
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
                                        <button className="btn btn-yellow">Reschedule</button>
                                        <button className="btn btn-blue">Cancel</button>
                                    </>
                                )}
                                {pickup.status === 'in-progress' && (
                                    <button className="btn btn-yellow">Track Live</button>
                                )}
                                {pickup.status === 'completed' && (
                                    <button className="btn btn-yellow">View Details</button>
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
                        {activeTab === 'bookings' && 'Schedule Pickup'}
                        {activeTab === 'status' && 'Track Your Pickups'}
                        {activeTab === 'products' && 'Eco Rewards Store'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Monitor your sustainable impact and eco-rewards progress'}
                        {activeTab === 'bookings' && 'Schedule waste collection and manage your pickup requests'}
                        {activeTab === 'status' && 'Track your waste pickup orders in real-time'}
                        {activeTab === 'products' && 'Redeem your earned eco-coins for sustainable products'}
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
                                    <FaTools className="booking-card-icon" />
                                    <div>
                                        <h2>Schedule Waste Pickup</h2>
                                        <p>Book a collection and earn eco-rewards</p>
                                    </div>
                                </div>

                                <div className="booking-card-content">
                                    

                                    <div className="booking-action-section">
                                        <div
                                            className="booking-main-option"
                                            onClick={() => setShowSchedulePickup(true)}
                                        >
                                            <div className="booking-main-icon">
                                                <FaCalendar />
                                            </div>
                                            <div className="booking-main-content">
                                                <h3>Schedule New Pickup</h3>
                                                <p>Book waste collection at your preferred time and location</p>
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
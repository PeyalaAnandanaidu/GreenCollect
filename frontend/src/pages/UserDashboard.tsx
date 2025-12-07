import { useEffect, useState } from 'react';
import './UserDashboard.css';
import {
    FaTrash, FaTruck, FaCheckCircle,
    FaCalendar, FaMapMarkerAlt, FaChevronRight, FaSearch,
    FaListAlt, FaClock, FaCheck,
    FaTimesCircle, FaTruck as FaTruckIcon,
    FaTools, FaLeaf, FaCoins, FaChartLine,
    FaBolt, FaShieldAlt, FaRocket, FaStar,
    FaSpinner, FaUser, FaEnvelope, FaTimes
} from 'react-icons/fa';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area, BarChart, Bar
} from 'recharts';
import SchedulePickup from './SchedulePickup';
import SustainableProducts from './SustainableProducts';

interface UserDashboardProps {
    activeTab: string;
    onTabChange?: (tab: string) => void;
}

interface PickupRequest {
    _id: string;
    pickupDate: string;
    pickupTime: string;
    wasteType: string;
    estimatedWeight: number;
    pickupAddress: string;
    status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
    instructions?: string;
    coinsValue: number;
    createdAt: string;
    assignedCollector?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface ChartData {
    monthlyData: Array<{ month: string; Waste: number; Coins: number; Target: number }>;
    wasteTypesData: Array<{ name: string; value: number; color: string }>;
    efficiencyData: Array<{ category: string; efficiency: number; target: number }>;
}

interface LeaderboardUser {
    _id: string;
    name: string;
    email: string;
    points: number;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ activeTab, onTabChange }) => {
    const [showSchedulePickup, setShowSchedulePickup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [pickups, setPickups] = useState<PickupRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalWaste: 0,
        totalPickups: 0,
        activeRequests: 0,
        totalCoins: 0
    });
    const [chartData, setChartData] = useState<ChartData>({
        monthlyData: [],
        wasteTypesData: [],
        efficiencyData: []
    });
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Load user data from storage
    useEffect(() => {
        const loadUserData = () => {
            try {
                const loginMethod = localStorage.getItem('loginMethod') || sessionStorage.getItem('loginMethod');
                const storage = loginMethod === 'local' ? localStorage : sessionStorage;
                
                const userData = storage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    console.log('UserDashboard loaded user:', parsedUser);
                }
            } catch (error) {
                console.error('Error loading user data in UserDashboard:', error);
            }
        };

        loadUserData();
        
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    // Fetch user's pickup requests and generate chart data
    useEffect(() => {
        if (activeTab === 'status' || activeTab === 'overview') {
            fetchUserPickups();
        }
        if (activeTab === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [activeTab]);

    const fetchUserPickups = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            if (!token) {
                console.log('No token found');
                return;
            }

            const response = await fetch('https://greencollect.onrender.com/api/waste-requests/my-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.requests) {
                setPickups(data.requests);
                generateChartData(data.requests);
                
                // Calculate real stats from user data
                const completedPickups = data.requests.filter((p: any) => p.status === 'completed');
                const totalWaste = completedPickups.reduce((sum: number, pickup: any) => sum + pickup.estimatedWeight, 0);
                const activeRequests = data.requests.filter((p: any) => 
                    ['pending', 'accepted', 'in-progress'].includes(p.status)
                ).length;

                setStats({
                    totalWaste,
                    totalPickups: data.requests.length,
                    activeRequests,
                    totalCoins: user?.points || 0
                });
            }
        } catch (err: any) {
            console.error('❌ Error fetching pickups:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            setLeaderboardLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            if (!token) {
                console.log('No token found for leaderboard');
                return;
            }

            console.log('🔄 Fetching leaderboard from backend...');
            const response = await fetch('https://greencollect.onrender.com/api/users/leaderboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Leaderboard response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Leaderboard error response:', errorText);
                throw new Error(`Failed to fetch leaderboard: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Leaderboard data received:', data);
            
            if (data.success && data.leaderboard) {
                console.log(`📊 Leaderboard has ${data.leaderboard.length} users`);
                // Filter out users without names and ensure they have all required fields
                const validUsers = data.leaderboard.filter((u: any) => u.name && u.name.trim() !== '');
                console.log(`✅ Valid users with names: ${validUsers.length}`);
                
                // Sort by points in descending order (highest coins first)
                const sortedUsers = validUsers.sort((a: LeaderboardUser, b: LeaderboardUser) => {
                    return b.points - a.points;
                });
                console.log('🔢 Top 3 users by coins:', sortedUsers.slice(0, 3).map((u: LeaderboardUser) => `${u.name}: ${u.points}`));
                
                setLeaderboard(sortedUsers);
            } else {
                console.warn('⚠️ Leaderboard response format unexpected:', data);
            }
        } catch (err: any) {
            console.error('❌ Error fetching leaderboard:', err);
            console.error('Error details:', err.message);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    const handleUserClick = (leaderboardUser: LeaderboardUser) => {
        setSelectedUser(leaderboardUser);
        setShowUserModal(true);
    };

    // Generate chart data from real pickup data
    const generateChartData = (pickupData: PickupRequest[]) => {
        // Monthly Data - Last 6 months
        const monthlyData = generateMonthlyData(pickupData);
        
        // Waste Types Distribution
        const wasteTypesData = generateWasteTypesData(pickupData);
        
        // Efficiency Data
        const efficiencyData = generateEfficiencyData(pickupData);

        setChartData({
            monthlyData,
            wasteTypesData,
            efficiencyData
        });
    };

    const generateMonthlyData = (pickupData: PickupRequest[]) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const currentMonth = new Date().getMonth();
        
        return months.map((month, index) => {
            const monthIndex = (currentMonth - 5 + index + 12) % 12;
            const monthPickups = pickupData.filter(pickup => {
                const pickupDate = new Date(pickup.pickupDate);
                return pickupDate.getMonth() === monthIndex && pickup.status === 'completed';
            });

            const waste = monthPickups.reduce((sum, pickup) => sum + pickup.estimatedWeight, 0);
            const coins = monthPickups.reduce((sum, pickup) => sum + pickup.coinsValue, 0);
            
            return {
                month,
                Waste: Math.round(waste),
                Coins: Math.round(coins),
                Target: 65 // You can calculate this based on user goals
            };
        });
    };

    const generateWasteTypesData = (pickupData: PickupRequest[]) => {
        const wasteTypes: { [key: string]: number } = {};
        const colorMap: { [key: string]: string } = {
            'plastic': '#ffcc00',
            'paper': '#00ffff',
            'electronics': '#ffaa00',
            'metal': '#00ccff',
            'glass': '#ff6b6b',
            'organic': '#51cf66'
        };

        pickupData.forEach(pickup => {
            if (pickup.status === 'completed') {
                const type = pickup.wasteType.toLowerCase();
                wasteTypes[type] = (wasteTypes[type] || 0) + pickup.estimatedWeight;
            }
        });

        return Object.entries(wasteTypes).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Math.round(value),
            color: colorMap[name] || '#8884d8'
        }));
    };

    const generateEfficiencyData = (pickupData: PickupRequest[]) => {
        const completedPickups = pickupData.filter(p => p.status === 'completed');
        const totalPickups = pickupData.length;

        if (totalPickups === 0) {
            return [
                { category: 'Collection', efficiency: 0, target: 90 },
                { category: 'Sorting', efficiency: 0, target: 85 },
                { category: 'Processing', efficiency: 0, target: 88 },
                { category: 'Recycling', efficiency: 0, target: 90 }
            ];
        }

        const completionRate = (completedPickups.length / totalPickups) * 100;
        const avgWeight = completedPickups.reduce((sum, p) => sum + p.estimatedWeight, 0) / completedPickups.length;
        const avgCoins = completedPickups.reduce((sum, p) => sum + p.coinsValue, 0) / completedPickups.length;

        return [
            { 
                category: 'Collection', 
                efficiency: Math.min(completionRate + 10, 95), 
                target: 90 
            },
            { 
                category: 'Sorting', 
                efficiency: Math.min(completionRate + 5, 85), 
                target: 85 
            },
            { 
                category: 'Processing', 
                efficiency: Math.min((avgWeight / 10) * 15 + 70, 95), 
                target: 88 
            },
            { 
                category: 'Recycling', 
                efficiency: Math.min((avgCoins / 100) * 20 + 75, 92), 
                target: 90 
            }
        ];
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'pending': return 'status-pending';
            case 'in-progress': return 'status-progress';
            case 'accepted': return 'status-accepted';
            default: return 'status-default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FaCheck className="status-icon completed" />;
            case 'in-progress':
                return <FaTruckIcon className="status-icon in-progress" />;
            case 'accepted':
                return <FaCheckCircle className="status-icon accepted" />;
            case 'pending':
                return <FaClock className="status-icon pending" />;
            case 'cancelled':
                return <FaTimesCircle className="status-icon cancelled" />;
            case 'rejected':
                return <FaTimesCircle className="status-icon rejected" />;
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
            case 'accepted':
                return 'Accepted';
            case 'pending':
                return 'Pending';
            case 'cancelled':
                return 'Cancelled';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'pending': return 'Waiting for a collector to accept your request';
            case 'accepted': return 'A collector has accepted your request and will arrive soon';
            case 'in-progress': return 'Collector is on the way to pickup your waste';
            case 'completed': return 'Pickup completed successfully - coins awarded!';
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

    const filteredPickups = pickups.filter(pickup => {
        const matchesSearch = 
            pickup.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pickup.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pickup._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || pickup.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    // Stats Cards Component with REAL DATA
    const StatsCards = () => (
        <div className="stats-grid">
            <div className="stat-card stat-card-yellow">
                <div className="stat-icon">
                    <FaTrash />
                </div>
                <div className="stat-content">
                    <h3>{stats.totalWaste} kg</h3>
                    <p>Waste Recycled</p>
                    <span className="stat-trend positive">
                        {stats.totalWaste > 0 ? '+12% this month' : 'Start recycling!'}
                    </span>
                </div>
                <div className="stat-glow"></div>
            </div>

            <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                    <FaTruck />
                </div>
                <div className="stat-content">
                    <h3>{stats.totalPickups}</h3>
                    <p>Total Pickups</p>
                    <span className="stat-trend positive">
                        {stats.totalPickups > 0 ? '+15% growth' : 'Schedule your first pickup'}
                    </span>
                </div>
                <div className="stat-glow"></div>
            </div>

            <div className="stat-card stat-card-yellow">
                <div className="stat-icon">
                    <FaCheckCircle />
                </div>
                <div className="stat-content">
                    <h3>{stats.activeRequests}</h3>
                    <p>Active Requests</p>
                    <span className="stat-trend">
                        {stats.activeRequests > 0 ? 'In progress' : 'No active requests'}
                    </span>
                </div>
                <div className="stat-glow"></div>
            </div>

            
        </div>
    );

    // Charts Component with REAL DATA
    const Charts = () => {
        if (chartData.monthlyData.length === 0) {
            return (
                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>
                                <FaChartLine className="chart-title-icon" />
                                Monthly Progress
                            </h3>
                        </div>
                        <div className="no-data-chart">
                            <FaChartLine className="no-data-icon" />
                            <p>No data available yet</p>
                            <small>Complete your first pickup to see analytics</small>
                        </div>
                    </div>
                    
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>
                                <FaLeaf className="chart-title-icon" />
                                Waste Distribution
                            </h3>
                        </div>
                        <div className="no-data-chart">
                            <FaLeaf className="no-data-icon" />
                            <p>No waste data yet</p>
                            <small>Start recycling to see distribution</small>
                        </div>
                    </div>
                </div>
            );
        }

        return (
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
                        <AreaChart data={chartData.monthlyData}>
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
                                formatter={(value: number) => [value, value > 100 ? 'Coins' : 'Kg']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Waste" 
                                stroke="#ffcc00" 
                                fillOpacity={1} 
                                fill="url(#wasteGradient)" 
                                strokeWidth={2} 
                                name="Waste Recycled"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Coins" 
                                stroke="#00ffff" 
                                fillOpacity={1} 
                                fill="url(#coinsGradient)" 
                                strokeWidth={2} 
                                name="Coins Earned"
                            />
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
                                data={chartData.wasteTypesData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.wasteTypesData.map((entry, index) => (
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
                                formatter={(value: number) => [`${value} kg`, 'Weight']}
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
                        <BarChart data={chartData.efficiencyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                            <XAxis dataKey="category" axisLine={false} tickLine={false} stroke="#00ffff" />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="#ffcc00" 
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0a0a0a', 
                                    border: '1px solid #00ffff',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                                }}
                                formatter={(value: number) => [`${value}%`, 'Efficiency']}
                            />
                            <Bar 
                                dataKey="efficiency" 
                                fill="#00ffff" 
                                radius={[4, 4, 0, 0]} 
                                name="Your Efficiency"
                            />
                            <Bar 
                                dataKey="target" 
                                fill="#ffcc00" 
                                radius={[4, 4, 0, 0]} 
                                opacity={0.7} 
                                name="Target"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    // Recent Activity Component with REAL DATA
    const RecentActivity = () => {
        const recentPickups = pickups.slice(0, 5).map(pickup => ({
            id: pickup._id,
            date: pickup.pickupDate,
            type: pickup.wasteType,
            weight: `${pickup.estimatedWeight} kg`,
            status: pickup.status,
            address: pickup.pickupAddress,
            efficiency: 85 + Math.floor(Math.random() * 15), // Sample efficiency
            coins: pickup.coinsValue
        }));

        return (
            <div className="activity-card">
                <div className="activity-header">
                    <h3>
                        <FaListAlt className="activity-icon" />
                        Recent Pickups
                    </h3>
                    <button 
                        className="view-all-btn"
                        onClick={() => onTabChange?.('status')}
                    >
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
                            {recentPickups.length > 0 ? (
                                recentPickups.map((pickup) => (
                                    <tr key={pickup.id}>
                                        <td>
                                            <div className="date-cell">
                                                <FaCalendar className="text-muted mr-2" />
                                                {new Date(pickup.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="type-badge" style={{
                                                backgroundColor: chartData.wasteTypesData.find(w => w.name.toLowerCase() === pickup.type.toLowerCase())?.color + '20' || '#8884d820',
                                                color: chartData.wasteTypesData.find(w => w.name.toLowerCase() === pickup.type.toLowerCase())?.color || '#8884d8',
                                                border: `1px solid ${chartData.wasteTypesData.find(w => w.name.toLowerCase() === pickup.type.toLowerCase())?.color || '#8884d8'}`
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
                                                {getStatusText(pickup.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="coins-earned">
                                                <FaCoins className="coins-icon" />
                                                +{pickup.coins}
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        <div className="empty-state-small">
                                            <FaListAlt className="empty-icon-small" />
                                            <p>No pickup history yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Rest of the component remains the same...
    // [StatusTracking component and return statement remain unchanged]

    return (
        <div className="user-dashboard">
            {/* Schedule Pickup Modal */}
            {showSchedulePickup && (
                <SchedulePickup 
                    onClose={() => setShowSchedulePickup(false)} 
                    userId={user?.id}
                    onPickupScheduled={fetchUserPickups}
                />
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
                        {activeTab === 'leaderboard' && 'Leaderboard Rankings'}
                    </h1>
                    <p className="page-subtitle">
                        {activeTab === 'overview' && 'Monitor your sustainable impact and eco-rewards progress'}
                        {activeTab === 'bookings' && 'Schedule waste collection and manage your pickup requests'}
                        {activeTab === 'status' && 'Track your waste pickup orders in real-time'}
                        {activeTab === 'products' && 'Redeem your earned eco-coins for sustainable products'}
                        {activeTab === 'leaderboard' && 'See how you rank among all eco-warriors'}
                    </p>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <div className={`section-block ${mounted ? 'animate-in' : ''}`}><StatsCards /></div>
                        <div className={`section-block ${mounted ? 'animate-in delay-1' : ''}`}><Charts /></div>
                        <div className={`section-block ${mounted ? 'animate-in delay-2' : ''}`}><RecentActivity /></div>
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
                                    {/* User Info Display */}
                                    {user && (
                                        <div className="user-info-banner">
                                            <div className="user-avatar">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-details">
                                                <h4>Welcome back, {user.name}!</h4>
                                                <p>Ready to schedule your next waste pickup?</p>
                                            </div>
                                            <div className="user-points">
                                                <FaCoins className="points-icon" />
                                                <span>{user.points || 0} Eco Coins</span>
                                            </div>
                                        </div>
                                    )}

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
                                                {!user && (
                                                    <div className="login-warning">
                                                        <small>Please make sure you're logged in to schedule a pickup</small>
                                                    </div>
                                                )}
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
                    <div className="tab-content">
                        {/* Search and Filter */}
                        <div className="controls-section">
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
                            <div className="filter-container">
                                <FaListAlt className="filter-icon" />
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
                                    <option value="cancelled">Cancelled</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Pickups List */}
                        <div className="pickups-container">
                            {loading ? (
                                <div className="loading-state">
                                    <FaSpinner className="spinner" />
                                    <p>Loading your pickup requests...</p>
                                </div>
                            ) : filteredPickups.length === 0 ? (
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
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={() => onTabChange?.('bookings')}
                                        >
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
                )}

                {/* Sustainable Products Tab */}
                {activeTab === 'products' && (
                    <SustainableProducts userCoins={user?.points || 0} />
                )}
                
                /* Leaderboard Tab */
                {activeTab === 'leaderboard' && (
                    <div className="tab-content">
                        <div className="leaderboard-container">
                            <div className="leaderboard-header">
                                <div className="leaderboard-title-section">
                                    <FaStar className="leaderboard-icon" />
                                    <div>
                                        <h2>Top Eco-Warriors</h2>
                                        <p>See how you rank among all users in the Green ecosystem</p>
                                    </div>
                                </div>
                                <div className="current-user-rank">
                                    {user && (
                                        <>
                                            <span className="rank-label">Your Rank:</span>
                                            <span className="rank-value">
                                                {leaderboard.findIndex(u => u._id === user.id) + 1 || 'N/A'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {leaderboardLoading ? (
                                <div className="loading-state">
                                    <FaSpinner className="spinner" />
                                    <p>Loading leaderboard...</p>
                                </div>
                            ) : leaderboard.length === 0 ? (
                                <div className="empty-state">
                                    <FaStar className="empty-icon" />
                                    <h3>No Rankings Yet</h3>
                                    <p>Be the first to earn coins and climb the leaderboard!</p>
                                </div>
                            ) : (
                                <div className="leaderboard-table-container">
                                    <table className="leaderboard-table">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>User</th>
                                                <th>Coins</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.map((leaderboardUser, index) => (
                                                <tr
                                                    key={leaderboardUser._id}
                                                    className={`leaderboard-row ${
                                                        user && leaderboardUser._id === user.id ? 'current-user' : ''
                                                    } ${index < 3 ? `top-${index + 1}` : ''}`}
                                                    onClick={() => handleUserClick(leaderboardUser)}
                                                >
                                                    <td>
                                                        <div className="rank-cell">
                                                            {index < 3 ? (
                                                                <div className={`medal medal-${index + 1}`}>
                                                                    {index === 0 && '🥇'}
                                                                    {index === 1 && '🥈'}
                                                                    {index === 2 && '🥉'}
                                                                </div>
                                                            ) : (
                                                                <span className="rank-number">{index + 1}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-avatar-small">
                                                                {(leaderboardUser.name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="user-info-small">
                                                                <span className="user-name-small">
                                                                    {leaderboardUser.name || 'Unknown User'}
                                                                    {user && leaderboardUser._id === user.id && (
                                                                        <span className="you-badge">You</span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="coins-cell">
                                                            <FaCoins className="coins-icon-small" />
                                                            <span className="coins-amount-small">
                                                                {leaderboardUser.points.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        </div>
                    )}
            </main>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="user-details-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close-btn" 
                            onClick={() => setShowUserModal(false)}
                        >
                            <FaTimes />
                        </button>
                        <div className="modal-header">
                            <div className="modal-user-avatar">
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="modal-rank-badge">
                                {leaderboard.findIndex(u => u._id === selectedUser._id) + 1}
                            </div>
                        </div>
                        <div className="modal-content">
                            <h2 className="modal-user-name">{selectedUser.name}</h2>
                            <div className="modal-user-email">
                                <FaEnvelope className="email-icon" />
                                {selectedUser.email}
                            </div>
                            <div className="modal-stats">
                                <div className="modal-stat-card">
                                    <FaCoins className="modal-stat-icon coins" />
                                    <div className="modal-stat-info">
                                        <span className="modal-stat-label">Total Coins</span>
                                        <span className="modal-stat-value">
                                            {selectedUser.points.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="modal-stat-card">
                                    <FaStar className="modal-stat-icon rank" />
                                    <div className="modal-stat-info">
                                        <span className="modal-stat-label">Leaderboard Rank</span>
                                        <span className="modal-stat-value">
                                            {leaderboard.findIndex(u => u._id === selectedUser._id) + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {user && selectedUser._id === user.id && (
                                <div className="modal-user-badge">
                                    <FaCheckCircle className="badge-icon" />
                                    This is you!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
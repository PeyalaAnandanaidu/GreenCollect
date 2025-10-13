import { useState, useEffect } from 'react';
import './Dashboard.css';
import UserDashboard from './UserDashboard';
import CollectorDashboard from './CollectorDashboard';
import AdminDashboard from './AdminDashboard';

type Role = 'user' | 'collector' | 'admin';

interface DashboardProps {
    role: Role;
    onLogout?: () => void;
    activeTab: string;
    userId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, onLogout, activeTab, userId }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {role === 'user' && (
                <UserDashboard 
                    activeTab={activeTab} 
                    userId={userId} 
                />
            )}
            {role === 'collector' && (
                <CollectorDashboard 
                    activeTab={activeTab} 
                    collectorId={userId} 
                />
            )}
            {role === 'admin' && (
                <AdminDashboard 
                    activeTab={activeTab} 
                    adminId={userId}
                />
            )}
        </div>
    );
};

export default Dashboard;
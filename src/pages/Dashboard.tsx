import { useState } from 'react';
import './Dashboard.css';
import UserDashboard from './UserDashboard';
import CollectorDashboard from './CollectorDashboard';
import AdminDashboard from './AdminDashboard';

type Role = 'user' | 'collector' | 'admin';

interface DashboardProps {
    role: Role;
    onLogout?: () => void;
    activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, onLogout, activeTab }) => {
    return (
        <div className="dashboard-container">
            {role === 'user' && (
                <AdminDashboard activeTab={activeTab} />
            )}
            {role === 'collector' && (
                <AdminDashboard activeTab={activeTab} />
            )}
            {role === 'admin' && (
                <AdminDashboard activeTab={activeTab} />
            )}
        </div>
    );
};

export default Dashboard;
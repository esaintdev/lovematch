import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdEdit, MdHistory, MdHome, MdLogout } from 'react-icons/md';
import MessageManager from './MessageManager.jsx';
import MatchHistory from './MatchHistory.jsx';
import './styles/Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMatches: 0,
        averagePercentage: 0,
        highestMatch: 0,
        lowestMatch: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { data: history, error } = await supabase
                .from('matches')
                .select('percentage');

            if (error) {
                console.error('Error fetching stats:', error);
                return;
            }

            if (history && history.length > 0) {
                const percentages = history.map(m => m.percentage);
                const total = percentages.reduce((a, b) => a + b, 0);

                setStats({
                    totalMatches: history.length,
                    averagePercentage: Math.round(total / history.length),
                    highestMatch: Math.max(...percentages),
                    lowestMatch: Math.min(...percentages)
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Dashboard Overview</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💕</div>
                    <div className="stat-value">{stats.totalMatches}</div>
                    <div className="stat-label">Total Matches</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-value">{stats.averagePercentage}%</div>
                    <div className="stat-label">Average Match</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{stats.highestMatch}%</div>
                    <div className="stat-label">Highest Match</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">❄️</div>
                    <div className="stat-value">{stats.lowestMatch}%</div>
                    <div className="stat-label">Lowest Match</div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/admin/messages" className="action-btn">
                        <MdEdit /> Manage Messages
                    </Link>
                    <Link to="/admin/history" className="action-btn">
                        <MdHistory /> View History
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Admin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="admin-container">
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h1>❤️ Love Match</h1>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}>
                        <MdDashboard className="sidebar-icon" />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link to="/admin/messages" className={`sidebar-link ${isActive('/admin/messages') ? 'active' : ''}`}>
                        <MdEdit className="sidebar-icon" />
                        {isSidebarOpen && <span>Messages</span>}
                    </Link>
                    <Link to="/admin/history" className={`sidebar-link ${isActive('/admin/history') ? 'active' : ''}`}>
                        <MdHistory className="sidebar-icon" />
                        {isSidebarOpen && <span>History</span>}
                    </Link>
                    <Link to="/" className="sidebar-link">
                        <MdHome className="sidebar-icon" />
                        {isSidebarOpen && <span>Home</span>}
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <MdLogout className="sidebar-icon" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/messages" element={<MessageManager />} />
                        <Route path="/history" element={<MatchHistory />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Admin;

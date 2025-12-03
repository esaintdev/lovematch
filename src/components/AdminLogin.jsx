import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdHome } from 'react-icons/md';
import './styles/Admin.css';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple password check (in production, use proper authentication)
        if (password === 'admin123') {
            localStorage.setItem('adminAuth', 'true');
            navigate('/admin');
        } else {
            setError('Incorrect password. Try "admin123"');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="login-icon">
                    <MdLock />
                </div>
                <h1>Admin Login</h1>
                <p className="admin-subtitle">Enter password to access admin panel</p>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="admin-btn">
                        Login
                    </button>

                    <button
                        type="button"
                        className="admin-btn secondary"
                        onClick={() => navigate('/')}
                    >
                        <MdHome /> Back to Home
                    </button>
                </form>

                <div className="admin-hint">
                    💡 Hint: Password is "admin123"
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

import React, { useState, useEffect } from 'react';
import './styles/Admin.css';

const MatchHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('matchHistory') || '[]');
        setHistory(saved);
    }, []);

    const clearHistory = () => {
        if (window.confirm('Clear all match history? This cannot be undone!')) {
            localStorage.removeItem('matchHistory');
            setHistory([]);
        }
    };

    const deleteMatch = (index) => {
        const updated = [...history];
        updated.splice(index, 1);
        localStorage.setItem('matchHistory', JSON.stringify(updated));
        setHistory(updated);
    };

    const filteredHistory = history.filter(match =>
        match.name1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.name2.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        switch (sortBy) {
            case 'percentage-high':
                return b.percentage - a.percentage;
            case 'percentage-low':
                return a.percentage - b.percentage;
            case 'date':
            default:
                return new Date(b.timestamp) - new Date(a.timestamp);
        }
    });

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const getMatchEmoji = (percentage) => {
        if (percentage >= 90) return '💯';
        if (percentage >= 70) return '🔥';
        if (percentage >= 40) return '👍';
        return '😅';
    };

    return (
        <div className="match-history">
            <div className="history-header">
                <h2>📜 Match History</h2>
                <button onClick={clearHistory} className="clear-btn">
                    Clear All History
                </button>
            </div>

            <div className="history-controls">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="date">Sort by Date</option>
                    <option value="percentage-high">Sort by Percentage (High to Low)</option>
                    <option value="percentage-low">Sort by Percentage (Low to High)</option>
                </select>
            </div>

            <div className="history-stats">
                <p>Total Matches: <strong>{history.length}</strong></p>
                <p>Showing: <strong>{sortedHistory.length}</strong></p>
            </div>

            {sortedHistory.length === 0 ? (
                <div className="empty-state">
                    <p>No matches found. {searchTerm ? 'Try a different search term.' : 'Start calculating some matches!'}</p>
                </div>
            ) : (
                <div className="history-list">
                    {sortedHistory.map((match, index) => (
                        <div key={index} className="history-item">
                            <div className="match-emoji">{getMatchEmoji(match.percentage)}</div>
                            <div className="match-details">
                                <div className="match-names">
                                    <strong>{match.name1}</strong> + <strong>{match.name2}</strong>
                                </div>
                                <div className="match-percentage">{match.percentage}%</div>
                                <div className="match-message">{match.message}</div>
                                <div className="match-date">{formatDate(match.timestamp)}</div>
                            </div>
                            <button onClick={() => deleteMatch(index)} className="delete-btn-small">
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchHistory;

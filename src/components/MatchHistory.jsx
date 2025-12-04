import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './styles/Admin.css';

const MatchHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
        } else {
            setHistory(data || []);
        }
    };

    const clearHistory = async () => {
        if (window.confirm('Clear all match history? This cannot be undone!')) {
            const { error } = await supabase
                .from('matches')
                .delete()
                .neq('id', 0); // Delete all rows where id is not 0 (effectively all)

            if (error) {
                console.error('Error clearing history:', error);
                alert('Failed to clear history');
            } else {
                setHistory([]);
            }
        }
    };

    const deleteMatch = async (id) => {
        const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting match:', error);
            alert('Failed to delete match');
        } else {
            setHistory(history.filter(match => match.id !== id));
        }
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
                return new Date(b.created_at) - new Date(a.created_at);
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
                    {sortedHistory.map((match) => (
                        <div key={match.id} className="history-item">
                            <div className="match-emoji">{getMatchEmoji(match.percentage)}</div>
                            <div className="match-details">
                                <div className="match-names">
                                    <strong>{match.name1}</strong> + <strong>{match.name2}</strong>
                                </div>
                                <div className="match-percentage">{match.percentage}%</div>
                                <div className="match-message">{match.message}</div>
                                <div className="match-date">{formatDate(match.created_at)}</div>
                            </div>
                            <button onClick={() => deleteMatch(match.id)} className="delete-btn-small">
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

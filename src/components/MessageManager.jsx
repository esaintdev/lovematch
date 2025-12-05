import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './styles/Admin.css';

const MessageManager = () => {
    const [messages, setMessages] = useState({
        perfect: [],
        high: [],
        medium: [],
        low: []
    });
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [addingTo, setAddingTo] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            // Group messages by category
            const grouped = {
                perfect: [],
                high: [],
                medium: [],
                low: []
            };

            data.forEach(msg => {
                if (grouped[msg.category]) {
                    grouped[msg.category].push(msg);
                }
            });

            setMessages(grouped);
        }
        setLoading(false);
    };

    const startEdit = (category, index) => {
        setEditingCategory(category);
        setEditingIndex(index);
        setEditValue(messages[category][index].text);
    };

    const saveEdit = async () => {
        const messageToUpdate = messages[editingCategory][editingIndex];

        const { error } = await supabase
            .from('messages')
            .update({ text: editValue })
            .eq('id', messageToUpdate.id);

        if (error) {
            console.error('Error updating message:', error);
            alert('Failed to update message');
        } else {
            await fetchMessages();
            setEditingCategory(null);
            setEditingIndex(null);
            setEditValue('');
        }
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setEditingIndex(null);
        setEditValue('');
    };

    const deleteMessage = async (category, index) => {
        if (messages[category].length <= 1) {
            alert('Cannot delete the last message in a category!');
            return;
        }

        const messageToDelete = messages[category][index];

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageToDelete.id);

        if (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        } else {
            await fetchMessages();
        }
    };

    const addMessage = async (category) => {
        if (!newMessage.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert([{ category, text: newMessage }]);

        if (error) {
            console.error('Error adding message:', error);
            alert('Failed to add message');
        } else {
            await fetchMessages();
            setNewMessage('');
            setAddingTo(null);
        }
    };

    const categoryLabels = {
        perfect: '💯 Perfect Match (90-100%)',
        high: '🔥 High Match (70-89%)',
        medium: '👍 Medium Match (50-69%)',
        low: '😅 Low Match (0-49%)'
    };

    if (loading) {
        return (
            <div className="message-manager">
                <div className="manager-header">
                    <h2>✏️ Message Manager</h2>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Loading messages...
                </div>
            </div>
        );
    }

    return (
        <div className="message-manager">
            <div className="manager-header">
                <h2>✏️ Message Manager</h2>
            </div>

            {Object.keys(messages).map(category => (
                <div key={category} className="message-category">
                    <h3>{categoryLabels[category]}</h3>

                    <div className="messages-list">
                        {messages[category].map((msg, index) => (
                            <div key={index} className="message-item">
                                {editingCategory === category && editingIndex === index ? (
                                    <div className="message-edit">
                                        <textarea
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="edit-actions">
                                            <button onClick={saveEdit} className="save-btn">Save</button>
                                            <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="message-text">{msg.text}</div>
                                        <div className="message-actions">
                                            <button onClick={() => startEdit(category, index)} className="edit-btn">
                                                Edit
                                            </button>
                                            <button onClick={() => deleteMessage(category, index)} className="delete-btn">
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {addingTo === category ? (
                        <div className="add-message-form">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Enter new message..."
                                rows={3}
                            />
                            <div className="add-actions">
                                <button onClick={() => addMessage(category)} className="save-btn">
                                    Add Message
                                </button>
                                <button onClick={() => { setAddingTo(null); setNewMessage(''); }} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setAddingTo(category)} className="add-btn">
                            + Add New Message
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MessageManager;

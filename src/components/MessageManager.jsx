import React, { useState, useEffect } from 'react';
import './styles/Admin.css';

const defaultMessages = {
    perfect: [
        "STOP EVERYTHING! Y'all are literally PERFECT together! Like, I'm not even joking, you should probably already have 3 kids and a golden retriever by now! 💍👶🐕",
        "Okay so like... 100%?? That's INSANE! You two are literally soulmates and I'm pretty sure the universe planned this before you were even born. Start planning the wedding ASAP! 💒✨",
        "I'm literally SCREAMING! This is the kind of love that makes people write songs and cry at weddings! You better name your first child after me for revealing this cosmic truth! 🎵😭"
    ],
    high: [
        "Okay okay okay, so like... this is REALLY good! I'm talking 'already planning couple Halloween costumes' good! You two need to stop playing around and just admit you're obsessed with each other! 🎃💕",
        "Not gonna lie, this percentage is giving 'already sharing Netflix passwords and arguing about what to watch' energy! That's basically marriage in 2024, so congrats! 📺💑",
        "Listen, I've seen a LOT of matches, and this? This is the 'texting each other memes at 3am' kind of connection. That's literally the foundation of true love, no cap! 📱✨"
    ],
    medium: [
        "Okay so it's not BAD, but like... it's giving 'we'd be cute together if we both tried' vibes. Maybe start with coffee? Or like, at least follow each other on Instagram? ☕📸",
        "Hmm, this is the 'could work but someone's gonna have to make the first move' situation. And by someone, I mean YOU. Stop being shy and shoot your shot! 🎯💪",
        "Not terrible! It's like when you match on a dating app and the conversation is okay but not amazing. Could be something? Maybe? Give it a shot and see what happens! 🤷‍♀️💬"
    ],
    low: [
        "Oof... okay so like, I'm not saying it's IMPOSSIBLE, but... actually yeah, I kinda am. This is giving 'better as friends' energy and honestly? That's valid too! 👥😅",
        "Listen, I'm gonna be real with you... this ain't it. Like, you'd have better chemistry with a random person at the grocery store. Maybe try the produce section? 🥕🛒",
        "Yikes on bikes! This match is giving 'we'd argue about literally everything' vibes. Like, y'all probably can't even agree on pizza toppings. Just... maybe keep swiping? 🍕👎"
    ]
};

const MessageManager = () => {
    const [messages, setMessages] = useState(defaultMessages);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [addingTo, setAddingTo] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('customMessages');
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);

    const saveMessages = (newMessages) => {
        localStorage.setItem('customMessages', JSON.stringify(newMessages));
        setMessages(newMessages);
    };

    const startEdit = (category, index) => {
        setEditingCategory(category);
        setEditingIndex(index);
        setEditValue(messages[category][index]);
    };

    const saveEdit = () => {
        const updated = { ...messages };
        updated[editingCategory][editingIndex] = editValue;
        saveMessages(updated);
        setEditingCategory(null);
        setEditingIndex(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setEditingIndex(null);
        setEditValue('');
    };

    const deleteMessage = (category, index) => {
        if (messages[category].length <= 1) {
            alert('Cannot delete the last message in a category!');
            return;
        }

        const updated = { ...messages };
        updated[category].splice(index, 1);
        saveMessages(updated);
    };

    const addMessage = (category) => {
        if (!newMessage.trim()) return;

        const updated = { ...messages };
        updated[category].push(newMessage);
        saveMessages(updated);
        setNewMessage('');
        setAddingTo(null);
    };

    const resetToDefault = () => {
        if (window.confirm('Reset all messages to default? This cannot be undone!')) {
            localStorage.removeItem('customMessages');
            setMessages(defaultMessages);
        }
    };

    const categoryLabels = {
        perfect: '💯 Perfect Match (90-100%)',
        high: '🔥 High Match (70-89%)',
        medium: '👍 Medium Match (40-69%)',
        low: '😅 Low Match (0-39%)'
    };

    return (
        <div className="message-manager">
            <div className="manager-header">
                <h2>✏️ Message Manager</h2>
                <button onClick={resetToDefault} className="reset-btn">
                    Reset to Default
                </button>
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
                                        <div className="message-text">{msg}</div>
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

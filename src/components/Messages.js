import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

function Messages() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');
    const currentUserId = sessionStorage.getItem('userId');
    const currentUserPhoto = sessionStorage.getItem('profilePhoto') || '';
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!token || !currentUserId) {
            navigate('/login');
        }
    }, [token, currentUserId, navigate]);

    useEffect(() => {
        if (!currentUserId) return;

        socket.emit('join', currentUserId);

        const handleNewMessage = (message) => {
            if (!message.from.photo && message.from._id === currentUserId && currentUserPhoto) {
                message.from.photo = currentUserPhoto;
            }
            if (message.from._id === selectedUserId || message.to._id === selectedUserId) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [currentUserId, selectedUserId, currentUserPhoto]);

    useEffect(() => {
        fetch('http://localhost:5001/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setUsers)
            .catch(err => console.error('Klaida gaunant vartotojus:', err));
    }, [token]);

    useEffect(() => {
        if (!selectedUserId) return;

        fetch(`http://localhost:5001/messages/conversation/${selectedUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const fixed = data.map(msg => {
                    if (!msg.from.photo && msg.from._id === currentUserId && currentUserPhoto) {
                        return { ...msg, from: { ...msg.from, photo: currentUserPhoto } };
                    }
                    return msg;
                });
                setMessages(fixed);
            })
            .catch(err => console.error('Klaida gaunant pokalbį:', err));
    }, [selectedUserId, token, currentUserId, currentUserPhoto]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        const selectedUser = users.find(u => u._id === selectedUserId);
        if (!selectedUser || newMessageText.trim() === '') return;

        const res = await fetch('http://localhost:5001/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ toUsername: selectedUser.username, text: newMessageText })
        });

        if (res.ok) {
            const newSentMsg = await res.json();
            if (!newSentMsg.from.photo && currentUserPhoto) {
                newSentMsg.from.photo = currentUserPhoto;
            }
            setMessages(prev => [...prev, newSentMsg]);
            setNewMessageText('');
        } else {
            const msg = await res.text();
            alert('Klaida: ' + msg);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar su vartotojų sąrašu */}
            <div className="w-1/4 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">💬 Pokalbiai</h2>
                {users.map(user => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUserId(user._id)}
                        className={`block w-full text-left px-4 py-2 rounded mb-2 ${
                            selectedUserId === user._id
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {user.username}
                    </button>
                ))}
            </div>

            {/* Pokalbių sritis */}
            <div className="w-3/4 flex flex-col p-6 bg-white dark:bg-gray-800 h-screen overflow-hidden">
                {selectedUserId && (
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={async () => {
                                const confirmDelete = window.confirm('Ar tikrai nori ištrinti visą pokalbį?');
                                if (!confirmDelete) return;

                                try {
                                    const res = await fetch(`http://localhost:5001/messages/conversation/${selectedUserId}`, {
                                        method: 'DELETE',
                                        headers: { Authorization: `Bearer ${token}` }
                                    });

                                    if (res.ok) {
                                        setMessages([]);
                                        alert('✅ Pokalbis ištrintas');
                                    } else {
                                        const errMsg = await res.text();
                                        alert('❌ Klaida: ' + errMsg);
                                    }
                                } catch (err) {
                                    console.error('❌ Klaida trinant pokalbį:', err);
                                    alert('Nepavyko ištrinti pokalbio');
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                        >
                            🗑 Ištrinti pokalbį
                        </button>
                    </div>
                )}

                {/* Žinučių langas */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.from._id === currentUserId;
                        const avatarUrl = msg.from.photo || 'https://via.placeholder.com/40';

                        return (
                            <div
                                key={index}
                                className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isCurrentUser && (
                                    <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                                )}
                                <div className={`px-4 py-2 rounded-xl max-w-xs ${
                                    isCurrentUser
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                {isCurrentUser && (
                                    <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input laukelis */}
                {selectedUserId && (
                    <div className="mt-4 flex gap-3">
                        <input
                            type="text"
                            placeholder="Rašyk žinutę..."
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Siųsti
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;

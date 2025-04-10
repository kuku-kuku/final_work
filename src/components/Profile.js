import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function Profile() {
    const [username, setUsername] = useState('');
    const [photo, setPhoto] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [passwordForUsernameChange, setPasswordForUsernameChange] = useState('');
    const [currentPasswordForPasswordChange, setCurrentPasswordForPasswordChange] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPhotoInput, setShowPhotoInput] = useState(false);

    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    const API_URL = 'http://localhost:5001';

    const fetchUserData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsername(res.data.username);
            setPhoto(res.data.photo || '');
            sessionStorage.setItem('profilePhoto', res.data.photo || '');
        } catch {
            setMessage('Nepavyko užkrauti naudotojo duomenų.');
        }
    }, [API_URL, userId, token]);

    useEffect(() => {
        const loadData = async () => {
            await fetchUserData();
        };
        loadData().catch((err) => {
            console.error('Klaida kraunant duomenis:', err);
        });
    }, [fetchUserData]);

    const updatePhoto = async () => {
        try {
            await axios.put(`${API_URL}/api/users/${userId}/photo`, { photo }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            sessionStorage.setItem('profilePhoto', photo);

            setMessage('Nuotrauka atnaujinta sėkmingai.');
            setPhoto('');
            setShowPhotoInput(false);
            await fetchUserData();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Klaida atnaujinant nuotrauką.');
        }
    };

    const updateUsername = async () => {
        if (!passwordForUsernameChange || !newUsername) {
            return setMessage('Įveskite naują vardą ir slaptažodį.');
        }
        try {
            const res = await axios.put(`${API_URL}/api/users/${userId}/username`, {
                newUsername,
                currentPassword: passwordForUsernameChange
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsername(newUsername);
            sessionStorage.setItem('username', newUsername);
            setNewUsername('');
            setPasswordForUsernameChange('');
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Klaida atnaujinant vartotojo vardą.');
        }
    };

    const updatePassword = async () => {
        if (!currentPasswordForPasswordChange || !newPassword) {
            return setMessage('Įveskite dabartinį ir naują slaptažodį.');
        }
        try {
            const res = await axios.put(`${API_URL}/api/users/${userId}/password`, {
                currentPassword: currentPasswordForPasswordChange,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentPasswordForPasswordChange('');
            setNewPassword('');
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Klaida keičiant slaptažodį.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-10">
            <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">⚙️ Profilio nustatymai</h2>

                {message && (
                    <p className="text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-700/30 border border-green-200 dark:border-green-600 rounded p-3 mb-6">
                        {message}
                    </p>
                )}

                {/* Profilio nuotrauka */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6">
                    <h3 className="text-lg font-semibold mb-3">🖼 Profilio nuotrauka</h3>

                    {photo && (
                        <img src={photo} alt="Profilio nuotrauka" className="w-32 rounded-lg mb-4" />
                    )}

                    {!showPhotoInput ? (
                        <button
                            onClick={() => setShowPhotoInput(true)}
                            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded transition mb-3"
                        >
                            🖼 Įkelti nuotrauką
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Įveskite nuotraukos URL"
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                                className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={() => setShowPhotoInput(false)}
                                className="text-sm text-blue-600 hover:underline mb-3 block"
                            >
                                🔙 Atšaukti
                            </button>
                        </>
                    )}

                    <button
                        onClick={updatePhoto}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Atnaujinti nuotrauką
                    </button>
                </div>

                {/* Keisti vartotojo vardą */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6">
                    <h3 className="text-lg font-semibold mb-3">📝 Keisti vartotojo vardą</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Dabartinis vardas: <span className="font-bold">{username}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="Naujas vardas"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Dabartinis slaptažodis"
                        value={passwordForUsernameChange}
                        onChange={(e) => setPasswordForUsernameChange(e.target.value)}
                        className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={updateUsername}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Atnaujinti vardą
                    </button>
                </div>

                {/* Keisti slaptažodį */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6">
                    <h3 className="text-lg font-semibold mb-3">🔒 Keisti slaptažodį</h3>
                    <input
                        type="password"
                        placeholder="Dabartinis slaptažodis"
                        value={currentPasswordForPasswordChange}
                        onChange={(e) => setCurrentPasswordForPasswordChange(e.target.value)}
                        className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Naujas slaptažodis"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={updatePassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Keisti slaptažodį
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;

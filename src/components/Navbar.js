import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [photo, setPhoto] = useState(sessionStorage.getItem('profilePhoto'));
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        const storedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedMode);
        document.documentElement.classList.toggle('dark', storedMode);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentPhoto = sessionStorage.getItem('profilePhoto');
            if (currentPhoto !== photo) {
                setPhoto(currentPhoto);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [photo]);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('darkMode', newMode);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 dark:text-white shadow-md px-6 py-3 flex justify-between items-center transition">
            {/* Kairė pusė – navigacija */}
            <div className="flex space-x-4 items-center">
                <Link to="/home" className="hover:scale-105 hover:text-blue-600 transition">🏠 Pradžia</Link>
                <Link to="/profile" className="hover:scale-105 hover:text-blue-600 transition">👤 Profilis</Link>
                <Link to="/create" className="hover:scale-105 hover:text-blue-600 transition">➕ Naujas įrašas</Link>
                <Link to="/messages" className="hover:scale-105 hover:text-blue-600 transition">💬 Žinutės</Link>
                <Link to="/favorites" className="hover:scale-105 hover:text-blue-600 transition">⭐ Mėgstamiausi</Link>
            </div>

            {/* Dešinė pusė */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleDarkMode}
                    className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded transition"
                >
                    {darkMode ? '☀️ Šviesi' : '🌙 Tamsi'}
                </button>

                <Link to="/profile">
                    {photo ? (
                        <img
                            src={photo}
                            alt="Profilis"
                            className="w-9 h-9 rounded-full object-cover border border-gray-400 dark:border-gray-600 hover:scale-105 transition"
                        />
                    ) : (
                        <span className="font-semibold">👋 {username}</span>
                    )}
                </Link>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                    🚪 Atsijungti
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

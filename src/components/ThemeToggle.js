import React, { useEffect, useState } from 'react';

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);
        document.documentElement.classList.toggle('dark', savedMode);
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('darkMode', newMode);
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow transition z-50"
        >
            {darkMode ? '☀️ Šviesi tema' : '🌙 Tamsi tema'}
        </button>
    );
}

export default ThemeToggle;

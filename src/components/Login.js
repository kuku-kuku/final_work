import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('profilePhoto');
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const data = await res.json();

                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('userId', data.userId);
                sessionStorage.setItem('username', form.username);

                const userRes = await fetch(`http://localhost:5001/api/users/${data.userId}`, {
                    headers: { Authorization: `Bearer ${data.token}` },
                });
                const userData = await userRes.json();
                sessionStorage.setItem('profilePhoto', userData.photo || '');

                alert('Prisijungimas sėkmingas!');
                navigate('/home');
            } else {
                const text = await res.text();
                setError(text);
            }
        } catch (err) {
            console.error('Klaida:', err);
            setError('Nepavyko susisiekti su serveriu.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Prisijungimas
                </h2>

                {error && (
                    <div className="bg-red-100 dark:bg-red-400/20 text-red-700 dark:text-red-300 p-3 mb-4 rounded">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Vartotojo vardas"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Slaptažodis"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
                    >
                        Prisijungti
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                    Neturi paskyros?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Registruokis čia
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;

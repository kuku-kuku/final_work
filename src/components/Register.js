import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const res = await fetch('http://localhost:5001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert('Registracija sėkminga!');
            navigate('/login');
        } else {
            const data = await res.json();
            setErrors(data.errors || ['Įvyko klaida']);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Registracija
                </h2>

                {errors.length > 0 && (
                    <ul className="bg-red-100 dark:bg-red-400/20 text-red-700 dark:text-red-300 p-3 mb-4 rounded">
                        {errors.map((err, idx) => (
                            <li key={idx}>⚠️ {err}</li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Vartotojo vardas"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Slaptažodis"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Pakartok slaptažodį"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
                    >
                        Registruotis
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                    Jau turi paskyrą?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Prisijunk čia
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;

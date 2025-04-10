import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            navigate('/login');
        }
    }, [username, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            return alert('Užpildyk visus laukus.');
        }

        try {
            const res = await fetch('http://localhost:5001/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, ownerUsername: username }),
            });

            if (res.ok) {
                alert('Postas sėkmingai sukurtas!');
                navigate('/home');
            } else {
                const text = await res.text();
                alert(`Klaida iš serverio: ${text}`);
            }
        } catch (err) {
            console.error('Klaida:', err);
            alert('Nepavyko susisiekti su serveriu.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">➕ Naujas įrašas</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Įrašo pavadinimas"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    />

                    <textarea
                        placeholder="Rašyk turinį čia..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="6"
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white resize-none"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
                    >
                        Paskelbti įrašą
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;

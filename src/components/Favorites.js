import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:5001/favorites', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setFavorites(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Klaida gaunant favorites:', err);
                setLoading(false);
            });
    }, [token, navigate]);

    const removeFavorite = async (postId) => {
        try {
            const res = await fetch(`http://localhost:5001/favorites/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setFavorites(favorites.filter(({ _id }) => _id !== postId));
            }
        } catch (err) {
            console.error('Klaida šalinant iš favorites:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
                <p className="text-lg">⏳ Kraunama...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">⭐ Mano mėgstamiausi postai</h2>

                {favorites.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400">Nėra pamėgtų postų.</p>
                ) : (
                    <div className="space-y-6">
                        {favorites.map(({ _id, title, content }) => (
                            <div
                                key={_id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow"
                            >
                                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{content}</p>
                                <button
                                    onClick={() => removeFavorite(_id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                >
                                    🗑 Pašalinti iš mėgstamiausių
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favorites;

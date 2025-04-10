import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:5001/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error('Klaida gaunant postus:', err));
    }, []);

    const handleTitleClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleUserClick = (username) => {
        navigate(`/user/${username}`);
    };

    const addToFavorites = async (postId) => {
        if (!token) {
            alert('Norėdami pridėti į favorites, turite prisijungti.');
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/favorites/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Pridėta į Mėgstamiausi!');
            } else {
                const errorText = await res.text();
                alert('Nepavyko pridėti: ' + errorText);
            }
        } catch (err) {
            console.error('Klaida pridedant į Mėgstamiausi:', err);
            alert('Klaida pridedant į Mėgstamiausi.');
        }
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">📋 Visi įrašai</h2>
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Postų nėra.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <div
                            key={post._id}
                            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col justify-between transition-transform transform hover:scale-[1.02]"
                        >
                            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Autorius:{' '}
                                <span
                                    className="text-green-600 dark:text-green-400 font-semibold cursor-pointer hover:underline"
                                    onClick={() => handleUserClick(post.ownerUsername)}
                                >
                                    {post.ownerUsername}
                                </span>
                            </div>

                            <h3
                                className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mb-2"
                                onClick={() => handleTitleClick(post._id)}
                            >
                                {post.title}
                            </h3>

                            <p className="text-gray-700 dark:text-gray-200 flex-grow">{post.content}</p>

                            <button
                                onClick={() => addToFavorites(post._id)}
                                className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-xl"
                            >
                                 Į Mėgstamiausi
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;

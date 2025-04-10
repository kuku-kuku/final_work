import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function SinglePost() {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const username = sessionStorage.getItem('username'); // 👈
    const token = sessionStorage.getItem('token');       // 👈
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5001/posts/${post_id}`)
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(err => console.error('Klaida gaunant postą:', err));
    }, [post_id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentText || !token) return;

        const res = await fetch(`http://localhost:5001/posts/${post_id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: commentText }),
        });

        if (res.ok) {
            const updated = await fetch(`http://localhost:5001/posts/${post_id}`);
            const updatedPost = await updated.json();
            setPost(updatedPost);
            setCommentText('');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Ar tikrai nori ištrinti šį postą?')) return;

        try {
            const res = await fetch(`http://localhost:5001/posts/${post_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Postas ištrintas sėkmingai.');
                navigate('/home');
            } else {
                const text = await res.text();
                alert('Klaida: ' + text);
            }
        } catch (err) {
            console.error('Klaida trinant:', err);
            alert('Serverio klaida.');
        }
    };

    if (!post) return <p className="text-center mt-10">⏳ Kraunama...</p>;

    const isOwner = post.ownerUsername === username;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 relative">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">{post.title}</h2>
                <p className="text-gray-700 dark:text-gray-200 mb-4">{post.content}</p>
                <p className="text-sm text-gray-500">✍️ Autorius: <span className="font-semibold">{post.ownerUsername}</span></p>

                {isOwner && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="text-sm text-red-600 hover:underline"
                        >
                            🗑️ Ištrinti
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
                <h4 className="text-lg font-semibold mb-4">💬 Komentarai</h4>
                {post.comments.length === 0 ? (
                    <p className="text-gray-500">Komentarų nėra.</p>
                ) : (
                    <div className="space-y-3">
                        {post.comments.map((comment, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                            >
                                <p className="text-sm">
                                    <span className="font-bold">{comment.author}</span>: {comment.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {token ? (
                <form
                    onSubmit={handleCommentSubmit}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
                >
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Rašyk komentarą..."
                        required
                        rows={3}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 dark:bg-gray-700 dark:text-white resize-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Komentuoti
                    </button>
                </form>
            ) : (
                <div className="text-center mt-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Norėdami komentuoti, <Link to="/login" className="text-blue-600 hover:underline">prisijunkite</Link>.
                    </p>
                </div>
            )}
        </div>
    );
}

export default SinglePost;

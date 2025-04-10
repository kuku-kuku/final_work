import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SingleUserPage() {
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios.get(`http://localhost:5001/api/user/${username}`)
            .then(res => setUserInfo(res.data))
            .catch(err => {
                console.error('User fetch error:', err);
                setError('Nepavyko gauti vartotojo informacijos');
            });

        axios.get(`http://localhost:5001/api/posts/user/${username}`)
            .then(res => setUserPosts(res.data))
            .catch(err => {
                console.error('Posts fetch error:', err);
                setError('Nepavyko gauti įrašų');
            });
    }, [username]);

    const handleSendMessage = async () => {
        if (!token) {
            setSuccess('Norėdami siųsti žinutę, prisijunkite.');
            return;
        }

        try {
            await axios.post(
                'http://localhost:5001/messages/send',
                { toUsername: username, text: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Žinutė išsiųsta!');
            setMessage('');
        } catch (err) {
            console.error('Send message error:', err);
            setSuccess('Nepavyko išsiųsti žinutės.');
        }
    };

    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (!userInfo) return <p className="text-center mt-10">⏳ Kraunama...</p>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">{userInfo.username}</h1>
                {userInfo.profilePhoto && (
                    <img
                        src={userInfo.profilePhoto}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 border"
                    />
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
                <h3 className="text-lg font-semibold mb-2">💬 Parašyk žinutę</h3>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tavo žinutė..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white mb-3"
                    rows={3}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                    Siųsti žinutę
                </button>
                {success && <p className="mt-3 text-green-600 dark:text-green-400">{success}</p>}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">📝 Vartotojo įrašai</h2>
                {userPosts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Šis vartotojas dar neturi įrašų.</p>
                ) : (
                    <ul className="space-y-3">
                        {userPosts.map(({ _id, title }) => (
                            <li key={_id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Link
                                    to={`/post/${_id}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

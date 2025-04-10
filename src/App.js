import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation
} from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import Messages from './components/Messages';
import Favorites from './components/Favorites';
import Navbar from './components/Navbar';
import SinglePost from './components/SinglePost';
import SingleUserPage from './components/SingleUserPage';
import ThemeToggle from "./components/ThemeToggle";
import './index.css';

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        if (token) {
            if (location.pathname === '/') {
                navigate('/home');
            }
        } else {
            if (location.pathname === '/') {
                navigate('/register');
            }
        }
    }, [location, token, navigate]);

    return (
        <>
            {isAuthPage && <ThemeToggle />}
            {!isAuthPage && <Navbar />}

            <div className={!isAuthPage ? 'pt-20 px-4 transition-colors duration-300' : ''}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create" element={<CreatePost />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/post/:post_id" element={<SinglePost />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/user/:username" element={<SingleUserPage />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
                <AppContent />
            </div>
        </Router>
    );
}

export default App;

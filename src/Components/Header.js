import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import '../Style/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">ANIVO</Link>
            </div>
            <nav className="nav-menu">
                {isLoggedIn ? (
                    <>
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/admin-movie" className="nav-link">Admin Movie</Link>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn">
                        <LogIn size={18} /> Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;

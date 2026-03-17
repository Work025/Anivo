import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import '../Style/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
            setUserName(JSON.parse(user).name);
        }
    }, [navigate]);

    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">ANIVO</Link>
            </div>
            <nav className="nav-menu">
                <Link to="/" className="nav-link">Bosh sahifa</Link>
                <Link to="/animelar" className="nav-link">Animelar</Link>
                <Link to="/mangalar" className="nav-link">Mangalar</Link>
                {isLoggedIn ? (
                    <Link to="/profile" className="nav-link profile-link">
                        <User size={18} /> <span className="user-name-header">{userName || 'Profil'}</span>
                    </Link>
                ) : (
                    <Link to="/login" className="login-btn">
                        <LogIn size={18} /> Kirish
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;

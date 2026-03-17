import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Play, BookOpen, User } from 'lucide-react';
import '../Style/BottomNav.css';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={22} />
                <span>Asosiy</span>
            </NavLink>
            <NavLink to="/animelar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Play size={22} />
                <span>Animelar</span>
            </NavLink>
            <NavLink to="/mangalar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <BookOpen size={22} />
                <span>Mangalar</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={22} />
                <span>Profil</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;

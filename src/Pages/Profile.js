import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import { LogOut, User, Mail, Calendar, Shield } from 'lucide-react';
import '../Style/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    if (!user) return <div className="loading">Yuklanmoqda...</div>;

    return (
        <div className="profile-wrapper pocket-spacing">
            <Header />
            <main className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-circle">
                            <User size={60} />
                        </div>
                        <h2>{user.name}</h2>
                        <span className="role-badge">{user.role === 'client' ? 'Mijoz' : 'Admin'}</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <Shield size={20} />
                            <div>
                                <p className="label">Foydalanuvchi ID</p>
                                <p className="value">{user.id}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <User size={20} />
                            <div>
                                <p className="label">To'liq ism</p>
                                <p className="value">{user.name} {user.surname}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Mail size={20} />
                            <div>
                                <p className="label">Email manzil</p>
                                <p className="value">{user.email || 'Kiritilmagan'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Calendar size={20} />
                            <div>
                                <p className="label">Telefon raqami</p>
                                <p className="value">{user.phone || 'Kiritilmagan'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={handleLogout} className="logout-full-btn">
                            <LogOut size={18} /> Tizimdan chiqish
                        </button>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import API_URL from '../apiConfig';
// import AnimeData from '../Data/Anime.json'; 
import '../Style/AnimeWatch.css';

const AnimeWatch = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/anime/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();

                if (result.success) {
                    setAnime(result.data);
                } else if (result.locked) {
                    setAnime({ locked: true, name: result.data?.name });
                }
            } catch (err) {
                console.error('Anime fetch error:', err);
            }
        };
        fetchAnime();
    }, [id]);

    if (!anime) return <div className="loading">Yuklanmoqda...</div>;

    if (anime.locked) {
        return (
            <div className="watch-container pocket-spacing">
                <Header />
                <div className="locked-content" style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
                    <i className="fa-solid fa-lock" style={{ fontSize: '50px', color: '#F43F5E', marginBottom: '20px' }}></i>
                    <h2>Bu kontent pullik</h2>
                    <p>Ushbu animeni tomosha qilish uchun hisobingizga kiring.</p>
                    <Link to="/login" className="main-login-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none', padding: '10px 30px', background: '#F43F5E', color: '#fff', borderRadius: '8px' }}>Kirish</Link>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="watch-container pocket-spacing">
            <Header />
            <main className="watch-main">
                <div className="video-section">
                    <iframe 
                        src={anime.videoUrl} 
                        title={anime.name}
                        frameBorder="0" 
                        allowFullScreen
                        className="main-player"
                    ></iframe>
                </div>
                <div className="info-section">
                    <h1>{anime.name}</h1>
                    <div className="meta">
                        <span className="year">{anime.year}</span>
                        <span className="genre">{anime.genre}</span>
                    </div>
                    <p className="description">{anime.description}</p>
                    <Link to="/" className="back-btn">Bosh sahifaga qaytish</Link>
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default AnimeWatch;

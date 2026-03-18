import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import API_URL from '../apiConfig';
// import MangaData from '../Data/Manga.json';
import '../Style/MangaRead.css';

const MangaRead = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/manga/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();

                if (result.success) {
                    setManga(result.data);
                } else if (result.locked) {
                    setManga({ locked: true, name: result.data?.name });
                }
            } catch (err) {
                console.error('Manga fetch error:', err);
            }
        };
        fetchManga();
    }, [id]);

    if (!manga) return <div className="loading">Yuklanmoqda...</div>;

    if (manga.locked) {
        return (
            <div className="read-container pocket-spacing">
                <Header />
                <div className="locked-content" style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
                    <i className="fa-solid fa-lock" style={{ fontSize: '50px', color: '#F43F5E', marginBottom: '20px' }}></i>
                    <h2>Bu kontent pullik</h2>
                    <p>Ushbu mangani o'qish uchun hisobingizga kiring.</p>
                    <Link to="/login" className="main-login-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none', padding: '10px 30px', background: '#F43F5E', color: '#fff', borderRadius: '8px' }}>Kirish</Link>
                </div>
                <BottomNav />
            </div>
        );
    }

    const chapters = manga.chapters.split('\n').filter(url => url.trim() !== '');

    return (
        <div className="read-container pocket-spacing">
            <Header />
            <main className="read-main">
                <h1>{manga.name}</h1>
                <div className="meta">
                    <span className="year">{manga.year}</span>
                    <span className="genre">{manga.genre}</span>
                </div>
                <div className="manga-pages">
                    {chapters.map((url, index) => (
                        <img key={index} src={url} alt={`Sahifa ${index + 1}`} className="manga-page" />
                    ))}
                </div>
                <div className="info-footer">
                    <p className="description">{manga.description}</p>
                    <Link to="/" className="back-btn">Bosh sahifaga qaytish</Link>
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default MangaRead;

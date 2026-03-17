import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import AnimeData from '../Data/Anime.json';
import '../Style/AnimeWatch.css';

const AnimeWatch = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const localAnime = JSON.parse(localStorage.getItem('anime_list') || '[]');
        const allAnime = [...AnimeData, ...localAnime];
        const found = allAnime.find(a => a.id.toString() === id);
        setAnime(found);
    }, [id]);

    if (!anime) return <div className="loading">Yuklanmoqda...</div>;

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

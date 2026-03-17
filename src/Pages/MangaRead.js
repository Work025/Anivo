import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import MangaData from '../Data/Manga.json';
import '../Style/MangaRead.css';

const MangaRead = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);

    useEffect(() => {
        const localManga = JSON.parse(localStorage.getItem('manga_list') || '[]');
        const allManga = [...MangaData, ...localManga];
        const found = allManga.find(m => m.id.toString() === id);
        setManga(found);
    }, [id]);

    if (!manga) return <div className="loading">Yuklanmoqda...</div>;

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

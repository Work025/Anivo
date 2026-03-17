import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import MangaData from '../Data/Manga.json';
import '../Style/Home.css'; // Reusing grid styles

const AllManga = () => {
    const [mangaList, setMangaList] = useState([]);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const res = await fetch('http://127.0.0.1:5000/api/manga');
                const data = await res.json();
                setMangaList(data);
            } catch (err) {
                console.error('Manga fetch error:', err);
            }
        };
        fetchManga();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-container pocket-spacing">
            <Header />
            <main className="home-main">
                <section className="content-section">
                    <div className="section-header">
                        <h2>Barcha Mangalar</h2>
                        <div className="line"></div>
                    </div>
                    <div className="cards-grid">
                        {mangaList.map((manga) => (
                            <div key={manga.id} className="content-card">
                                <div className="card-image">
                                    <img src={manga.coverUrl} alt={manga.name} />
                                    <div className="card-overlay">
                                        <Link to={`/manga/${manga.id}`} className="read-btn">
                                            O'qish
                                        </Link>
                                    </div>
                                    <span className="card-year">{manga.year}</span>
                                </div>
                                <div className="card-info">
                                    <h3>{manga.name}</h3>
                                    <p>{manga.genre}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
};

export default AllManga;

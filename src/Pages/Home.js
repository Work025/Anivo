import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import '../Style/Home.css';

const Home = () => {
    const [animeList, setAnimeList] = useState([]);
    const [mangaList, setMangaList] = useState([]);
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [animeRes, mangaRes, wikiRes] = await Promise.all([
                    fetch('http://127.0.0.1:5000/api/anime'),
                    fetch('http://127.0.0.1:5000/api/manga'),
                    fetch('http://127.0.0.1:5000/api/wiki')
                ]);

                const animeData = await animeRes.json();
                const mangaData = await mangaRes.json();
                const wikiData = await wikiRes.json();

                setAnimeList(animeData);
                setMangaList(mangaData);
                setWikiData(wikiData);
            } catch (err) {
                console.error('Content fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) return <div className="loading">Yuklanmoqda...</div>;
    if (!wikiData) return (
        <div className="error-container">
            <h2>Ma'lumotlarni yuklashda xatolik!</h2>
            <p>Iltimos, server ishlayotganiga ishonch hosil qiling.</p>
            <code>Terminalda: npm run dev buyrug'ini bering</code>
        </div>
    );

    return (
        <div className="home-container pocket-spacing">
            <Header />
            <main className="home-main">
                <section className="hero-section">
                    <h1>ANIVO <span className="highlight">STUDIO</span></h1>
                    <p>Bizning original anime va manga loyihalarimiz olamiga xush kelibsiz.</p>
                </section>

                <section className="content-section">
                    <div className="section-header">
                        <h2>Original Animelar</h2>
                        <div className="line"></div>
                    </div>
                    <div className="cards-grid">
                        {animeList.map((anime) => (
                            <div key={anime.id} className="content-card">
                                <div className="card-image">
                                    <img src={anime.thumbnail} alt={anime.name} />
                                    <div className="card-overlay">
                                        <Link to={`/anime/${anime.id}`} className="play-btn">
                                            <span className="play-icon">▶</span>
                                        </Link>
                                    </div>
                                    <span className="card-year">{anime.year}</span>
                                </div>
                                <div className="card-info">
                                    <h3>{anime.name}</h3>
                                    <p>{anime.genre}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="content-section">
                    <div className="section-header">
                        <h2>Original Mangalar</h2>
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

export default Home;

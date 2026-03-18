import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import API_URL from '../apiConfig';
import '../Style/Home.css';

const Home = () => {
    const [animeList, setAnimeList] = useState([]);
    const [mangaList, setMangaList] = useState([]);
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("📡 Hozirgi API manzili:", API_URL);
        const fetchContent = async () => {
            try {
                const [animeRes, mangaRes, wikiRes] = await Promise.all([
                    fetch(`${API_URL}/api/anime`),
                    fetch(`${API_URL}/api/manga`),
                    fetch(`${API_URL}/api/wiki`)
                ]);
                
                if (!animeRes.ok || !mangaRes.ok) throw new Error("Server xatosi");

                const animeResult = await animeRes.json();
                const mangaResult = await mangaRes.json();
                const wikiResult = await wikiRes.json();

                if (animeResult.success) setAnimeList(animeResult.data);
                if (mangaResult.success) setMangaList(mangaResult.data);
                setWikiData(wikiResult); // Wiki is still raw for now
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
        <div className="error-container" style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
            <h2 style={{ color: '#F43F5E' }}>Server bilan bog'lanib bo'lmadi</h2>
            <p>Internet ulanishini tekshiring yoki keyinroq qayta urinib ko'ring.</p>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', maxWidth: '500px', margin: '20px auto' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Texnik ma'lumot:</p>
                <code>Backend ulanishi rad etildi yoki server kutish rejimida.</code>
                <br/>
                <code style={{fontSize: '11px', opacity: 0.7}}>{API_URL}</code>
            </div>
            <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', background: '#F43F5E', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}>
                Qayta yuklash
            </button>
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

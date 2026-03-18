import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNav from '../Components/BottomNav';
import API_URL from '../apiConfig';
import '../Style/Home.css'; // Reusing grid styles
// import AnimeData from '../Data/Anime.json'; 

const AllAnime = () => {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const response = await fetch(`${API_URL}/api/anime`);
                const result = await response.json();
                if (result.success) setAnimeList(result.data);
            } catch (err) {
                console.error('Anime fetch error:', err);
            }
        };
        fetchAnime();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-container pocket-spacing">
            <Header />
            <main className="home-main">
                <section className="content-section">
                    <div className="section-header">
                        <h2>Barcha Animelar</h2>
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
            </main>
            <BottomNav />
        </div>
    );
};

export default AllAnime;

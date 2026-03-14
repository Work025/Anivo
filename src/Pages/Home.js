import React from 'react';
import Header from '../Components/Header';
import '../Style/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text)', fontSize: '3rem', marginBottom: '20px' }}>Welcome to Anivo</h1>
        <p style={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '1.2rem' }}>
          Explore the world of movies and media. Please login to access more features.
        </p>
      </main>
    </div>
  );
};

export default Home;

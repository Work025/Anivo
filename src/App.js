import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import AdminSXD from './Pages/AdminSXD';
import Adminpanel from './Pages/Adminpanel';

import AnimeWatch from './Pages/AnimeWatch';
import MangaRead from './Pages/MangaRead';
import Profile from './Pages/Profile';
import AllAnime from './Pages/AllAnime';
import AllManga from './Pages/AllManga';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/anime/:id" element={<AnimeWatch />} />
          <Route path="/manga/:id" element={<MangaRead />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/animelar" element={<AllAnime />} />
          <Route path="/mangalar" element={<AllManga />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Adminmovie from './Pages/Adminmovie';
import AdminSXD from './Pages/AdminSXD';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-movie" element={<Adminmovie />} />
          <Route path="/AdminCodSXD88" element={<AdminSXD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

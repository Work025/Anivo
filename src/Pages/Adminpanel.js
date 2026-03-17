import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Adminpanel.css';
import DataAdmin from '../Data/Admin.json';

const Adminpanel = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [adminsData, setAdminsData] = useState(DataAdmin.admins);
    
    // Uploader forms state
    const [contentType, setContentType] = useState('anime'); // 'anime' yoki 'manga'
    const [animeData, setAnimeData] = useState({
        name: '',
        genre: '',
        year: '',
        description: '',
        videoUrl: '',
        thumbnail: ''
    });

    const [mangaData, setMangaData] = useState({
        name: '',
        genre: '',
        year: '',
        description: '',
        coverUrl: '',
        chapters: '' // JSON string yoki havolalar
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/AdminCodSXD88'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/AdminCodSXD88');
    };

    const handleAnimeSubmit = (e) => {
        e.preventDefault();
        const existingAnime = JSON.parse(localStorage.getItem('anime_list') || '[]');
        const newAnime = { ...animeData, id: Date.now() };
        existingAnime.push(newAnime);
        localStorage.setItem('anime_list', JSON.stringify(existingAnime));
        
        alert('Anime muvaffaqiyatli joylandi!');
        setAnimeData({ name: '', genre: '', year: '', description: '', videoUrl: '', thumbnail: '' });
    };

    const handleMangaSubmit = (e) => {
        e.preventDefault();
        const existingManga = JSON.parse(localStorage.getItem('manga_list') || '[]');
        const newManga = { ...mangaData, id: Date.now() };
        existingManga.push(newManga);
        localStorage.setItem('manga_list', JSON.stringify(existingManga));
        
        alert('Manga muvaffaqiyatli joylandi!');
        setMangaData({ name: '', genre: '', year: '', description: '', coverUrl: '', chapters: '' });
    };

    const handleAnimeChange = (e) => {
        setAnimeData({ ...animeData, [e.target.name]: e.target.value });
    };

    const handleMangaChange = (e) => {
        setMangaData({ ...mangaData, [e.target.name]: e.target.value });
    };

    const handleAdminEdit = (adminId, field, value) => {
        const updatedAdmins = adminsData.map(admin => {
            if (admin.id === adminId) {
                return { ...admin, [field]: value };
            }
            return admin;
        });
        setAdminsData(updatedAdmins);
    };

    const saveAdminData = () => {
        alert('Admin ma\'lumotlari yangilandi!');
    };

    if (!user) return <div className="admin-loading">Yuklanmoqda...</div>;

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <h2>Admin Panel - {user.name} ({user.role === 'superadmin' ? 'Bosh Admin' : 'Yuklovchi'})</h2>
                <button className="logout-btn" onClick={handleLogout}>Chiqish</button>
            </header>

            <main className="admin-main-content">
                {user.role === 'superadmin' && (
                    <div className="superadmin-section">
                        <h3>Admin Ma'lumotlarini Boshqarish</h3>
                        <div className="admin-list">
                            {adminsData.map((admin) => (
                                <div key={admin.id} className="admin-card">
                                    <h4>{admin.adminTitle}</h4>
                                    <div className="admin-field">
                                        <label>ID:</label>
                                        <input type="text" value={admin.id} onChange={(e) => handleAdminEdit(admin.id, 'id', e.target.value)} />
                                    </div>
                                    <div className="admin-field">
                                        <label>Parol:</label>
                                        <input type="text" value={admin.password} onChange={(e) => handleAdminEdit(admin.id, 'password', e.target.value)} />
                                    </div>
                                    <div className="admin-field">
                                        <label>Maxfiy Kalit (Security Key):</label>
                                        <input type="text" value={admin.securityKey} onChange={(e) => handleAdminEdit(admin.id, 'securityKey', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="save-btn" onClick={saveAdminData}>O'zgarishlarni Saqlash</button>
                    </div>
                )}

                {(user.role === 'uploader' || user.role === 'superadmin') && (
                    <div className="uploader-section" style={{ marginTop: user.role === 'superadmin' ? '40px' : '0' }}>
                        <div className="content-tabs" style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
                            <button 
                                className={`tab-btn ${contentType === 'anime' ? 'active' : ''}`}
                                onClick={() => setContentType('anime')}
                                style={{
                                    padding: '10px 25px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: contentType === 'anime' ? '#1f6feb' : '#30363d',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Anime Qo'shish
                            </button>
                            <button 
                                className={`tab-btn ${contentType === 'manga' ? 'active' : ''}`}
                                onClick={() => setContentType('manga')}
                                style={{
                                    padding: '10px 25px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: contentType === 'manga' ? '#1f6feb' : '#30363d',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Manga Qo'shish
                            </button>
                        </div>

                        {contentType === 'anime' ? (
                            <form className="anime-upload-form" onSubmit={handleAnimeSubmit}>
                                <h3>Yangi Anime Joylash</h3>
                                <div className="form-group">
                                    <label>Anime Nomi:</label>
                                    <input type="text" name="name" value={animeData.name} onChange={handleAnimeChange} required placeholder="Masalan: Naruto" />
                                </div>
                                <div className="form-group">
                                    <label>Janr:</label>
                                    <input type="text" name="genre" value={animeData.genre} onChange={handleAnimeChange} required placeholder="Masalan: Shounen, Sarguzasht" />
                                </div>
                                <div className="form-group">
                                    <label>Chiqqan Yili:</label>
                                    <input type="number" name="year" value={animeData.year} onChange={handleAnimeChange} required placeholder="Masalan: 2002" />
                                </div>
                                <div className="form-group">
                                    <label>Tavsif:</label>
                                    <textarea 
                                        name="description" 
                                        value={animeData.description} 
                                        onChange={handleAnimeChange} 
                                        required 
                                        placeholder="Anime haqida qisqacha..."
                                        style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', padding: '10px', minHeight: '100px', outline: 'none' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Video Havolasi (URL):</label>
                                    <input type="url" name="videoUrl" value={animeData.videoUrl} onChange={handleAnimeChange} required placeholder="https://example.com/video.mp4" />
                                </div>
                                <div className="form-group">
                                    <label>Poster Havolasi (Thumbnail URL):</label>
                                    <input type="url" name="thumbnail" value={animeData.thumbnail} onChange={handleAnimeChange} required placeholder="https://example.com/image.jpg" />
                                </div>
                                <button type="submit" className="submit-btn" style={{ background: '#238636' }}>Animeni Saqlash</button>
                            </form>
                        ) : (
                            <form className="anime-upload-form" onSubmit={handleMangaSubmit}>
                                <h3>Yangi Manga Joylash</h3>
                                <div className="form-group">
                                    <label>Manga Nomi:</label>
                                    <input type="text" name="name" value={mangaData.name} onChange={handleMangaChange} required placeholder="Masalan: One Piece" />
                                </div>
                                <div className="form-group">
                                    <label>Janr:</label>
                                    <input type="text" name="genre" value={mangaData.genre} onChange={handleMangaChange} required placeholder="Masalan: Sarguzasht, Fantastika" />
                                </div>
                                <div className="form-group">
                                    <label>Chiqqan Yili:</label>
                                    <input type="number" name="year" value={mangaData.year} onChange={handleMangaChange} required placeholder="Masalan: 1997" />
                                </div>
                                <div className="form-group">
                                    <label>Tavsif:</label>
                                    <textarea 
                                        name="description" 
                                        value={mangaData.description} 
                                        onChange={handleMangaChange} 
                                        required 
                                        placeholder="Manga haqida qisqacha..."
                                        style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', padding: '10px', minHeight: '100px', outline: 'none' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Muqova Havolasi (Cover URL):</label>
                                    <input type="url" name="coverUrl" value={mangaData.coverUrl} onChange={handleMangaChange} required placeholder="https://example.com/cover.jpg" />
                                </div>
                                <div className="form-group">
                                    <label>Boblar Havolalari (Har bir qatorga bitta havola):</label>
                                    <textarea 
                                        name="chapters" 
                                        value={mangaData.chapters} 
                                        onChange={handleMangaChange} 
                                        required 
                                        placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg"
                                        style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', padding: '10px', minHeight: '120px', outline: 'none' }}
                                    />
                                </div>
                                <button type="submit" className="submit-btn" style={{ background: '#238636' }}>Mangani Saqlash</button>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Adminpanel;

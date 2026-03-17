const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Helper functions for data management
const getDataPath = (filename) => path.join(__dirname, 'data', filename);

const readData = (filename) => {
    try {
        const data = fs.readFileSync(getDataPath(filename), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filename}:`, err);
        return filename.endsWith('.json') && !filename.includes('wiki') ? [] : {};
    }
};

const writeData = (filename, data) => {
    try {
        fs.writeFileSync(getDataPath(filename), JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing to ${filename}:`, err);
        return false;
    }
};

// --- API ROUTES ---

// 1. Content Delivery
app.get('/api/anime', (req, res) => res.json(readData('anime.json')));
app.get('/api/manga', (req, res) => res.json(readData('manga.json')));
app.get('/api/wiki', (req, res) => res.json(readData('wiki.json')));

// 2. Authentication
app.post('/api/register', (req, res) => {
    const { name, surname, email, phone, password, id } = req.body;
    const db = readData('users.json');
    
    // Simple check if user exists
    if (db.users.find(u => u.email === email || u.phone === phone)) {
        return res.status(400).json({ message: 'Ushbu email yoki telefon band' });
    }

    const newUser = { id, name, surname, email, phone, password, role: 'client' };
    db.users.push(newUser);
    writeData('users.json', db);
    
    res.status(201).json({ message: 'Muvaffaqiyatli ro\'yxatdan o\'tildi', user: newUser });
});

app.post('/api/login', (req, res) => {
    const { loginInput, password } = req.body;
    const db = readData('users.json');

    // Check Admins
    const admin = db.admins.find(a => a.id === loginInput && a.password === password);
    if (admin) {
        return res.json({ 
            user: { role: admin.role, name: admin.adminTitle, id: admin.id }
        });
    }

    // Check Users
    const user = db.users.find(u => 
        (u.id === loginInput || u.phone === loginInput || u.email === loginInput) && u.password === password
    );

    if (user) {
        return res.json({ 
            user: { 
                role: 'client', 
                name: user.name, 
                surname: user.surname, 
                email: user.email, 
                phone: user.phone, 
                id: user.id 
            }
        });
    }

    res.status(401).json({ message: 'Ma\'lumotlar xato yoki bunday hisob mavjud emas' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

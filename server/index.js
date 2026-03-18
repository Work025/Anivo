require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

// Models
const User = require('./models/User');
const Anime = require('./models/Anime');
const Manga = require('./models/Manga');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'anivo_PRO_sk_92jdKJASD8123jd92jd_ASKD';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB ulanishi muvaffaqiyatli!'))
    .catch((err) => {
        console.error('❌ MongoDB ulanishida xatolik:', err.message);
    });

// Rate Limiting for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { success: false, message: 'Harakatlar soni oshib ketdi. Iltimos, birozdan keyin urinib ko‘ring.' }
});

app.use(cors({
    origin: [
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "https://anivo.vercel.app",
        "https://anivo-plcnu0k7z-fozilxons-projects.vercel.app",
        "https://anivo-git-main-fozilxons-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());

// Middleware: Verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token muddati tugagan yoki noto‘g‘ri' });
        }
        req.user = user;
        next();
    });
};

// Helper: Standard Response
const sendRes = (res, status, success, message, data = null) => {
    return res.status(status).json({ success, message, data });
};

// --- API ROUTES ---

// 1. Content Delivery
app.get('/api/anime', async (req, res) => {
    try {
        const animeList = await Anime.find();
        sendRes(res, 200, true, 'Muvaffaqiyatli', animeList);
    } catch (err) {
        sendRes(res, 500, false, 'Ma\'lumotlarni olishda xatolik');
    }
});

app.get('/api/anime/:id', verifyToken, async (req, res) => {
    try {
        const anime = await Anime.findOne({ id: req.params.id });
        if (!anime) return sendRes(res, 404, false, 'Anime topilmadi');

        // PAID CONTENT PROTECTION
        if (anime.access === 'paid' && !req.user) {
            return res.status(200).json({ 
                success: false, 
                locked: true, 
                message: 'Bu kontent pullik. Iltimos, hisobga kiring.',
                data: { name: anime.name, access: 'paid' } 
            });
        }

        sendRes(res, 200, true, 'Muvaffaqiyatli', anime);
    } catch (err) {
        sendRes(res, 500, false, 'Server xatoligi');
    }
});

app.get('/api/manga', async (req, res) => {
    try {
        const mangaList = await Manga.find();
        sendRes(res, 200, true, 'Muvaffaqiyatli', mangaList);
    } catch (err) {
        sendRes(res, 500, false, 'Ma\'lumotlarni olishda xatolik');
    }
});

app.get('/api/manga/:id', verifyToken, async (req, res) => {
    try {
        const manga = await Manga.findOne({ id: req.params.id });
        if (!manga) return sendRes(res, 404, false, 'Manga topilmadi');

        // PAID CONTENT PROTECTION
        if (manga.access === 'paid' && !req.user) {
            return res.status(200).json({ 
                success: false, 
                locked: true, 
                message: 'Bu kontent pullik. Iltimos, hisobga kiring.',
                data: { name: manga.name, access: 'paid' } 
            });
        }

        sendRes(res, 200, true, 'Muvaffaqiyatli', manga);
    } catch (err) {
        sendRes(res, 500, false, 'Server xatoligi');
    }
});

app.get('/api/wiki', async (req, res) => {
    try {
        // Mock wiki data for now or just return empty
        sendRes(res, 200, true, 'Muvaffaqiyatli', []);
    } catch (err) {
        sendRes(res, 500, false, 'Wiki error');
    }
});

// 2. Authentication
app.post('/api/register', async (req, res) => {
    try {
        const { name, surname, email, phone, password, id } = req.body;
        console.log(`[AUTH] Yangi foydalanuvchi: ${name} (${email})`);
        
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return sendRes(res, 400, false, 'Ushbu email yoki telefon band');
        }

        const newUser = new User({ id, name, surname, email, phone, password, role: 'client' });
        await newUser.save();
        
        sendRes(res, 201, true, 'Muvaffaqiyatli ro\'yxatdan o\'tildi', { user: newUser });
    } catch (err) {
        sendRes(res, 500, false, 'Ro\'yxatdan o\'tishda xatolik');
    }
});

app.post('/api/login', authLimiter, async (req, res) => {
    try {
        const { loginInput, password } = req.body;
        console.log(`[AUTH] Loginga urinish: ${loginInput}`);

        const user = await User.findOne({ 
            $and: [
                { $or: [{ id: loginInput }, { phone: loginInput }, { email: loginInput }] },
                { password: password }
            ]
        });

        if (user) {
            const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
            return sendRes(res, 200, true, `Xush kelibsiz! ${user.role === 'admin' ? '(Admin)' : ''}`, { 
                token,
                user: { 
                    role: user.role, 
                    name: user.name, 
                    surname: user.surname, 
                    email: user.email, 
                    phone: user.phone, 
                    id: user.id 
                }
            });
        }

        sendRes(res, 401, false, 'Ma\'lumotlar xato yoki bunday hisob mavjud emas');
    } catch (err) {
        sendRes(res, 500, false, 'Server xatoligi');
    }
});

app.post('/api/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return sendRes(res, 400, false, 'Token topilmadi');

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        console.log(`[AUTH] Google orqali kirish: ${name} (${email})`);

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = new User({
                id: `google_${googleId.slice(-6)}`, // Generate simple ID
                name,
                email,
                picture,
                googleId,
                role: 'client'
            });
            await user.save();
        } else {
            // Link Google ID if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                user.picture = picture;
                await user.save();
            }
        }

        const customToken = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        
        sendRes(res, 200, true, 'Muvaffaqiyatli! (Google)', { 
            token: customToken,
            user: { 
                role: user.role, 
                name: user.name, 
                email: user.email, 
                picture: user.picture,
                id: user.id 
            }
        });

    } catch (err) {
        console.error('❌ Google verification failed:', err.message);
        sendRes(res, 401, false, 'Google identifikatsiyasi xato');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

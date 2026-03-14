require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

// ==========================================
// MONGODB CONNECTION
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anivo_db';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB ulangan');
}).catch((err) => {
    console.error('❌ MongoDB ulanishida xato:', err);
});

// ==========================================
// USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    username: String,
    registeredAt: { type: Date, default: Date.now },
    anivoId: { type: String, unique: true } // Tizimdagi "SXD-12345" ID uchun
});

const User = mongoose.model('User', userSchema);

// ==========================================
// BOT CONFIGURATION
// ==========================================
// Foydalanuvchi taqdim etgan Token (Yoki .env orqali)
const BOT_TOKEN = process.env.BOT_TOKEN || '8688523625:AAFHoOKCdIJv56FXygxz03OGmnpuEVAyjEM';
const bot = new Telegraf(BOT_TOKEN);

// Generate SXD ID
const generateAnivoId = () => {
    return 'SXD-' + Math.floor(100000 + Math.random() * 900000);
};

bot.start(async (ctx) => {
    const telegramId = ctx.from.id.toString();
    
    try {
        let user = await User.findOne({ telegramId });
        
        if (!user) {
            user = new User({
                telegramId,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
                username: ctx.from.username,
                anivoId: generateAnivoId()
            });
            await user.save();
            
            ctx.reply(`👋 Xush kelibsiz, ${ctx.from.first_name}!\n\nSiz ANIVO SXD (Saqlangan Xavfsiz Dastur) tizimidan muvaffaqiyatli ro'yxatdan o'tdingiz.\n\nSizning login ID raqamingiz: <b>${user.anivoId}</b>\n\nIltimos, saytdan ulanishda ushbu ID dan foydalaning.`, { parse_mode: 'HTML' });
        } else {
            ctx.reply(`👋 Qaytganingiz bilan, ${ctx.from.first_name}!\n\nSizning SXD ID raqamingiz: <b>${user.anivoId}</b>`, { parse_mode: 'HTML' });
        }
        
    } catch (error) {
        console.error('Bot xatolik:', error);
        ctx.reply('❌ Tizimda xatolik yuz berdi. Iltimos keyinroq urining.');
    }
});

bot.help((ctx) => {
    ctx.reply('Yordam:\n1. Saytga kirish uchun ID ni nusxalang.\n2. Saytdagi "Email, Tel yoki ID" qatoriga ID ni kiriting.');
});

bot.launch().then(() => {
    console.log('🤖 Anivocom_bot Telegram boti ishga tushdi...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const User = require('./models/User');
const Anime = require('./models/Anime');
const Manga = require('./models/Manga');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for migration');

        const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));

        // 1. Migrate Anime
        const animeData = readJSON('anime.json');
        await Anime.deleteMany({}); // Clear existing
        await Anime.insertMany(animeData);
        console.log(`✅ Migrated ${animeData.length} anime items`);

        // 2. Migrate Manga
        const mangaData = readJSON('manga.json');
        await Manga.deleteMany({});
        await Manga.insertMany(mangaData);
        console.log(`✅ Migrated ${mangaData.length} manga items`);

        // 3. Migrate Users (including admins)
        const userData = readJSON('users.json');
        const allUsers = [];
        
        if (userData.admins) {
            userData.admins.forEach(admin => {
                allUsers.push({
                    id: admin.id,
                    name: admin.adminTitle,
                    password: admin.password,
                    role: 'admin'
                });
            });
        }
        
        if (userData.users) {
            userData.users.forEach(user => {
                allUsers.push({ ...user, role: 'client' });
            });
        }

        await User.deleteMany({});
        await User.insertMany(allUsers);
        console.log(`✅ Migrated ${allUsers.length} users (including admins)`);

        console.log('🚀 Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();

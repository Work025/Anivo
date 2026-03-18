const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    genre: { type: String },
    year: { type: String },
    description: { type: String },
    videoUrl: { type: String },
    thumbnail: { type: String },
    access: { type: String, enum: ['free', 'paid'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('Anime', animeSchema);

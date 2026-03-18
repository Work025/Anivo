const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    genre: { type: String },
    year: { type: String },
    description: { type: String },
    coverUrl: { type: String },
    chapters: { type: String }, // Stored as newline separated URLs for now
    access: { type: String, enum: ['free', 'paid'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('Manga', mangaSchema);

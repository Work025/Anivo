const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: { type: String }, // Optional for Google users
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    role: { type: String, default: 'client' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    url: { type: String, required: true }
});

const conservancyPageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    mainContent: { type: String },
    vision: { type: String },
    mission: { type: String },
    achievements: [String],
    heroImage: { type: String },
    gallery: [galleryImageSchema]
}, { timestamps: true });

module.exports = mongoose.model('ConservancyPage', conservancyPageSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    metaDescription: { type: String },
    purpose: String,
    goals: [String],
    status: { type: String, enum: ['Ongoing', 'Completed', 'Planning'], default: 'Planning' },
    coverImage: { type: String, required: true },
    galleryImages: [String],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
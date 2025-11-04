const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    metaDescription: { type: String },
    category: { type: String, enum: ['Wildlife', 'Youth', 'Environment', 'Community'], default: 'Community' },
    author: { type: String, default: 'KNC Staff' },
    featuredImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
